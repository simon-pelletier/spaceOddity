/* ========================================================================== */
/*                                                                            */
/*                                PLANET - SCENE                              */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';

import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

import defaultSceneConfig from '../helpers/sceneConfig';

import Ship from '../objects/Ship';
import PlanetAlone from '../objects/PlanetAlone';
import Geyser from '../objects/Geyser';
import RawMat from '../objects/RawMat';

class PlanetScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'PlanetScene',
            physics: {
                matter: {
                    debug: Setup.DEVMOD,
                    gravity: {
                        y: Setup.GRAVITY
                    }
                },
                arcade: {
                    gravity: {
                        y: Setup.GRAVITY
                    },
                    debug: Setup.DEVMOD
                }
            }
        });
    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {

        /* ------------------------------ SCENE CONFIG ------------------------------ */

        // Variables Globales
        var self = this;

        this.currentMaterial = null;
        this.currentMaterialObj = null;

        var seedSystem = Game.univers[Game.currentSystem];
        var seedPlanet = Game.univers[Game.currentSystem].system[Game.currentPlanet];

        // Configure la scene par défaut
        defaultSceneConfig(this);

        // Active le PlugIn Attractor pour la gravité d'un GameObject
        this.matter.enableAttractorPlugin();

        // Background - Ajout de groupe d'étoiles_mini
        this.backGround = this.add.group({
            key: 'starTwoPx',
            frameQuantity: 3000
        });

        /* ------------------------------- BACKGROUND ------------------------------- */

        // Converti la couleur de planet en RGB
        var colorRgb = seedPlanet.color.substring(2, seedPlanet.length);
        var colorTab = Helpers.convertHexToRgbArray(colorRgb);
        // Couleur du ciel - #bleu
        this.skyColor = new Phaser.Display.Color((colorTab[0] / 2.5).toFixed(0), (colorTab[1] / 0.4).toFixed(0), 160);
        // Couleur de l'espace - #noir
        this.spaceColor = new Phaser.Display.Color(0, 0, 0);
        // Création des étoiles_mini
        var starBackGround = new Phaser.Geom.Rectangle(-Setup.WIDTH * 2.5 - 2000, -Setup.HEIGHT * 5 - 2000, Setup.WIDTH * 5 + 4000, Setup.HEIGHT * 10 + 4000);
        Phaser.Actions.RandomRectangle(this.backGround.getChildren(), starBackGround);

        /* --------------------------------- BOUNDS --------------------------------- */

        // Dessine un cercle de BOUNDS
        var circle = new Phaser.Geom.Circle(0, 0, 3000);
        // Récupère 12 points le long du cercle
        var points = circle.getPoints(12);
        // Définit les marges de rotation entre les elements de bors
        var marginAngleBounds = 5.3;
        var marginBounds = 0;
        for (var b = 0; b < points.length; b++) {
            // Ajoute et configure un nouvel élément de bors de scene
            var boundBlock = this.matter.add.rectangle(points[b].x, points[b].y, 2000, 100, {
                isStatic: true,
                angle: 1.56 + ((b + marginBounds) / points.length),
                label: 'bounds'
            });
            marginBounds += marginAngleBounds;
        }

        /* -------------------------------- CONTROLS -------------------------------- */

        // Désactive le menu contextuel
        this.input.mouse.disableContextMenu();

        /* ------------------------------ GAME OBJECTS ------------------------------ */

        // Object Planet
        this.planet = new PlanetAlone({
            scene: this,
            x: 0,
            y: 0,
            key: 'planet',
            seed: seedPlanet
        });

        // Définit la planète comme visitée
        this.planet.setVisited();

        // Si c'est un début de partie, le ship est posé, sinon il arrive du ciel
        if (Game.firstPlanet == true) {
            // Object Ship
            this.ship = new Ship({
                scene: this,
                x: 0,
                y: -400,
                key: 'ship',
                size: 0.2,
                env: 'planet'
            });

            // Fin du premier Spawn
            Game.firstPlanet = false;
        } else {
            // Object Ship
            this.ship = new Ship({
                scene: this,
                x: Helpers.getRandomNumber(-Setup.WIDTH / 4, Setup.WIDTH / 4),
                y: -Setup.HEIGHT * 4.8,
                key: 'ship',
                size: 0.2,
                env: 'planet'
            });
            // Orientation du Ship vers le sol
            this.ship.body.setAngle(Helpers.getRandomNumber(140, 220));
        }

        /* -------------------------------- MATERIALS ------------------------------- */

        // Contient tout les Materiaux (array)
        this.materials = [];

        // Dessine un cercle
        this.circleMaterial = new Phaser.Geom.Circle(0, 0, (this.planet.size * 375) + 20);
        // Récupère 12 points le long du cercle
        this.pointsMaterial = this.circleMaterial.getPoints(12);

        // Dessine un cercle
        this.circleMaterialInfo = new Phaser.Geom.Circle(0, 0, (this.planet.size * 375) + 150);
        // Récupère 12 points le long du cercle
        this.pointsMaterialInfo = this.circleMaterialInfo.getPoints(12);

        // Marges pour les orientations de geysers
        var marginAngleMaterial = 5.3;
        var marginMaterial = 0;

        // Création et configuration de chaque Material
        for (var e = 0; e < seedPlanet.materials.length; e++) {
            // Si c'est un Geyser
            if (seedPlanet.materials[e].sort == 'geyser') {
                this.Geyser = new Geyser({
                    scene: this,
                    id: seedPlanet.materials[e].id,
                    sort: seedPlanet.materials[e].sort,
                    points: this.pointsMaterial,
                    pointsInfo: this.pointsMaterialInfo,
                    margin: marginMaterial,
                    quantity: seedPlanet.materials[e].quantity
                });
                this.materials.push(this.Geyser);
                // Si c'est VIDE
            } else if (seedPlanet.materials[e].sort == 'rawMat') {
                this.RawMat = new RawMat({
                    scene: this,
                    id: seedPlanet.materials[e].id,
                    sort: seedPlanet.materials[e].sort,
                    points: this.pointsMaterial,
                    pointsInfo: this.pointsMaterialInfo,
                    margin: marginMaterial,
                    quantity: seedPlanet.materials[e].quantity
                });
                this.materials.push(this.RawMat);
            } else {
                this.materials.push('empty');
            }
            // Ajout de l'angle pour le point suivant
            marginMaterial += marginAngleMaterial;
        }

        /* ------------------------------- COLLSISIONS ------------------------------ */

        this.ship.collisionsPlanet(this, this.ship);

        Game.ship = this.ship;

        Game.currentScene = 'Planet';

        this.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {

                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                // SENSORS (SHIP)
                if (bodyA.isSensor || bodyB.isSensor) {

                    // SHIP - GEYSER
                    if (bodyA.label === 'bottomM' || bodyB.label === 'bottomM') {
                        if (bodyA.label === 'geyserBody' || bodyB.label === 'geyserBody' || bodyA.label === 'rawMatBody' || bodyB.label === 'rawMatBody') {

                            if (bodyB.label === 'geyserBody') {
                                self.currentMaterial = bodyB.data.id;
                                self.currentMaterialObj = bodyB.parent.gameObject;
                            } else if (bodyB.label === 'rawMatBody') {
                                self.currentMaterial = bodyB.data.id;
                                self.currentMaterialObj = bodyB.parent.gameObject;
                            } else {
                                self.currentMaterial = bodyA.data.id;
                                self.currentMaterialObj = bodyA.parent.gameObject;
                            }
                            console.log('DIG IT !');
                        }
                    }
                }
            }
        });

        this.matter.world.on('collisionend', function (event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {

                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                // SENSORS (SHIP)
                if (bodyA.isSensor || bodyB.isSensor) {

                    // SHIP - GEYSER
                    if (bodyA.label === 'bottomM' || bodyB.label === 'bottomM') {
                        if (bodyA.label === 'geyserBody' || bodyB.label === 'geyserBody') {
                            self.currentMaterial = null;
                            self.currentMaterialObj = null;
                            console.log('NO MORE ON GEYSER !');
                        } else if (bodyA.label === 'rawMatBody' || bodyB.label === 'rawMatBody') {
                            self.currentMaterial = null;
                            self.currentMaterialObj = null;
                            console.log('NO MORE ON RAW MATS !');
                        }
                    }

                }

            }
        });

        /* ----------------------------- Player Controls ---------------------------- */

        Game.player.controls(this);

        /* --------------------------------- SOUNDS --------------------------------- */

        // Ajout du son de Pompe
        this.soundPump = this.sound.add('pump');
        this.soundPump.volume = 0.5;
        this.soundPump.loop = true;

        /* -------------------------------- LISTENERS ------------------------------- */

        this.input.keyboard.on('keydown', function (event) {

            if (self.currentMaterial) {
                if (event.key == 'e' && self.materials[self.currentMaterial].sort == 'geyser') {
                    //soundPump.loop = true;
                    self.soundPump.play();
                }
            }

        });

        this.input.keyboard.on('keyup', function (event) {

            if (event.key == 'e') {
                self.soundPump.stop();
            }

        });

    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

        var self = this;

        /* -------------------------------- Variables ------------------------------- */

        var shipPosition = this.ship.body.body.position;

        /* ------------------------------ Update Camera ----------------------------- */

        this.cameras.main.centerOn(shipPosition.x, shipPosition.y);

        /* ------------------------ Update GameObject Planet ------------------------ */

        this.planet.update();

        /* ------------------------- Update GameObject Ship ------------------------- */

        this.ship.updatePlanet();

        /* ------------------------ Update GameObject Geyser ------------------------ */

        if (this.currentMaterial !== null) {
            this.materials[this.currentMaterial].update(this.currentMaterial);

            if (this.materials[this.currentMaterial].quantity < 0) {
                this.currentMaterialObj.destroy();
                Game.univers[Game.currentSystem].system[Game.currentPlanet].materials[this.currentMaterial].sort = 'empty';
            }
        }

        /* ------------------------- Update Player Controls ------------------------- */

        Game.player.updateControls(this);

        /* ---------------- Update de la couleur du background camera --------------- */

        if (Math.abs(shipPosition.y) > Math.abs(shipPosition.x)) {
            if (shipPosition.y < 0) {
                var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(this.skyColor, this.spaceColor, -Setup.HEIGHT * 5, shipPosition.y);
            } else if (shipPosition.y > 0) {
                var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(this.skyColor, this.spaceColor, Setup.HEIGHT * 5, shipPosition.y);
            }
        } else if (Math.abs(shipPosition.y) < Math.abs(shipPosition.x)) {
            if (shipPosition.x < 0) {
                var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(this.skyColor, this.spaceColor, -Setup.WIDTH * 2.5, shipPosition.x);
            } else if (shipPosition.x > 0) {
                var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(this.skyColor, this.spaceColor, Setup.WIDTH * 2.5, shipPosition.x);
            }
        }
        this.cameras.main.setBackgroundColor(hexColor);

        /* ---------------------------- Calcul d'altitude --------------------------- */

        this.ship.setAltitude(Helpers.getDistanceBetween(this.planet.body.position, shipPosition));

        if (Game.player.isOver()) {
            if (Game.player.isDead == false) {
                Game.player.isDead = true;
                setTimeout(function () {
                    // Lance la scene End Game
                    self.scene.stop('UiScene');
                    self.scene.stop('PlanetScene');
                    self.scene.stop('SystemScene');
                    self.scene.stop('MapScene');
                    self.scene.start('EndGameScene');
                }, 2000);
            } else {

            }

        }

    }

}

export default PlanetScene;
