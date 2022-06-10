import Game from '../game';

import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

import defaultSceneConfig from '../helpers/sceneConfig';

import Ship from '../objects/Ship';
import Star from '../objects/Star';
import Planet from '../objects/Planet';
import Asteroid from '../objects/Asteroid';

class SystemScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'SystemScene',
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

    create() {
        /* ------------------------------ SCENE CONFIG ------------------------------ */

        // Variables Globales
        var self = this;
        this.systemSceneIsLoaded = false;

        this.scene.wake('UiScene');

        // Configure la scene par défaut
        defaultSceneConfig(this);
        Game.selectedPlanetOnOver = null;

        Game.systemStartTime = 0;

        var seedSystem = Game.univers[Game.currentSystem];
        var seedPlanet =
            Game.univers[Game.currentSystem].system[Game.currentPlanet];

        // Active le PlugIn Attractor pour la gravité d'un GameObject
        this.matter.enableAttractorPlugin();

        /* ------------------------------- BACKGROUND ------------------------------- */

        // Background - Ajout de groupe d'étoiles_mini
        this.backGround = this.add.group({
            key: 'starTwoPx',
            frameQuantity: 800
        });

        var starBackGround = new Phaser.Geom.Rectangle(
            -1000,
            -1000,
            Game.canvas.clientWidth + 2000,
            Game.canvas.clientHeight + 2000
        );
        Phaser.Actions.RandomRectangle(
            this.backGround.getChildren(),
            starBackGround
        );

        /* ---------------------------------- TEXTS --------------------------------- */

        // Définit le Style du text systemText
        var styleTextSystem = {
            fontSize: '20px',
            fontFamily: Setup.TYPO,
            color: '#141414',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        };

        // Ajoute le texte systemText
        this.systemText = this.add
            .text(0, 0, '', styleTextSystem)
            .setPadding(10, 10);
        this.systemText.setDepth(0);
        this.systemText.setPosition(
            Game.canvas.clientWidth / 2 - 500,
            Game.canvas.clientHeight / 2 - 150
        );

        this.systemText.setText(Game.univers[Game.currentSystem].name);

        // Définit le Style du text infoPlanetTxt
        var styleText = {
            fontSize: '16px',
            fontFamily: Setup.TYPO,
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        };

        // Ajoute le texte infoPlanetTxt
        this.infoPlanetTxt = this.add
            .text(100, 50, '', styleText)
            .setPadding(10, 10);
        this.infoPlanetTxt.setDepth(30);

        /* ------------------------------ GAME OBJECTS ------------------------------ */

        // Object Star
        this.star = new Star({
            scene: this,
            x: Game.canvas.clientWidth / 2,
            y: Game.canvas.clientHeight / 2,
            key: 'star',
            seed: seedSystem.system[0]
        });

        if (
            Game.lastSystemPosition == undefined ||
            Game.lastSystemPosition == null
        ) {
            // Object Ship
            this.ship = new Ship({
                scene: this,
                x: Game.canvas.clientWidth / 2 - 1000,
                y: Game.canvas.clientHeight / 2,
                key: 'ship',
                size: 0.1,
                env: 'system'
            });
        } else {
            // Object Ship
            this.ship = new Ship({
                scene: this,
                x: Game.lastSystemPosition.x,
                y: Game.lastSystemPosition.y + 20,
                key: 'ship',
                size: 0.1,
                env: 'system'
            });
        }

        // Pour chaque Asteroide
        for (var a = 0; a < seedSystem.asteroidsFactor; a++) {
            // Object Asteroid
            this.asteroid = new Asteroid({
                scene: this,
                key: 'asteroid'
            });
        }

        // Objects PLANETS
        // Efface les paths d'animation
        this.currentSystemPaths = [];
        this.currentSystemPlanets = [];
        this.currentSystemSatCurves = [];

        // Ajout des graphics à la scene
        this.graphicsPlanet = this.add.graphics();

        // Pour chaque Planet
        for (var p = 0; p < seedSystem.system.length; p++) {
            // Object Planet
            this.planet = new Planet({
                scene: this,
                x: 0,
                y: 0,
                key: 'planet',
                seed: seedSystem.system[p],
                id: p
            });

            // Créé un Chemin pour la Planet
            this.path = new Phaser.Curves.Ellipse(
                Game.canvas.clientWidth / 2,
                Game.canvas.clientHeight / 2,
                this.planet.distance * 2
            );

            // Effectue une rotation sur le Chemin pour décaller les Planets
            this.path.setRotation(this.planet.distance);

            // Ajoute le Chemin au tableau des chemins du system en cours
            this.currentSystemPaths.push(this.path);

            // Animation Tween de la Planet
            this.tweens.add({
                targets: self.planet.bodyPlanet,
                z: 1,
                ease: 'Linear',
                duration: self.planet.speed * 3,
                repeat: -1
            });

            // Ajoute la Planet au tableau du System en cours
            this.currentSystemPlanets.push(this.planet);

            // SATELLITES
            if (seedSystem.system[p].satellites[0] !== 'none') {
                // Dessine le Chemin du Satellite
                this.curveSat = new Phaser.Curves.Ellipse(
                    this.planet.bodyPlanet.x,
                    this.planet.bodyPlanet.y,
                    seedSystem.system[p].satellites[0].distance,
                    seedSystem.system[p].satellites[0].distance,
                    0,
                    360,
                    false
                );
                this.curveSat.draw(this.graphicsPlanet);

                // Ajoute et configure le Satellite
                var sat = this.add.follower(
                    this.curveSat,
                    this.planet.bodyPlanet.x +
                        seedSystem.system[p].satellites[0].distance,
                    this.planet.bodyPlanet.y,
                    'satellite'
                );
                // .setInteractive({
                //           cursor: 'url(./assets/cursor/alt.cur), pointer'
                //         });
                sat.setScale(seedSystem.system[p].satellites[0].size / 200);
                sat.setTintFill(seedSystem.system[p].satellites[0].color);
                sat.setData({
                    satId: p,
                    name: seedSystem.system[p].satellites[0].name
                });
                sat.startFollow({
                    ease: 'Linear',
                    duration: seedSystem.system[p].satellites[0].speed * 2,
                    yoyo: false,
                    repeat: -1
                });

                // Ajoute le chemin du Satellite au tableau des Sat du System
                this.currentSystemSatCurves.push(this.curveSat);
            } else {
                // Ajoute 'none' si la Planet n'a pas de Sat
                this.currentSystemSatCurves.push('none');
            }
        }

        /* ------------------------------- COLLISIONS ------------------------------- */

        if (this.asteroid) {
            this.asteroid.collisions(self, this.asteroid);
        }

        this.ship.collisionsSystem(this, this.ship);

        // Confirme le chargement de la scene (évite les erreurs d'update sur les gameObjects)
        this.systemSceneIsLoaded = true;

        Game.currentScene = 'System';

        Game.ship = this.ship;

        /* ----------------------------- Player Controls ---------------------------- */

        Game.player.controls(this);

        this.input.on('gameobjectover', function (pointer, gameObject, event) {
            // Calcul de la distance Ship - Planet
            // var distanceX = Math.abs(currentShip.x - gameObject.x);
            // var distanceY = Math.abs(currentShip.y - gameObject.y);
            // var distance = distanceX + distanceY;
            // GameObject Planet sélectionné
            Game.selectedPlanetOnOver = gameObject;
            // Définit le contenu de la zone de texte
            self.infoPlanetTxt.setText();
            // Positionne la zone de texte sur la Planet
            self.infoPlanetTxt.setPosition(
                gameObject.x + 20,
                gameObject.y - 20
            );
        });

        // On KeyDown Global
        this.input.keyboard.on('keydown', function (event) {
            // "M" a été pressé
            if (event.key == 'm') {
                Game.selectedPlanetOnOver = null;

                // Lance la scene Map
                self.scene.pause();
                self.scene.visible = false;
                self.scene.launch('MapScene');
            }
        });
    }

    update() {
        /* -------------------------------- Variables ------------------------------- */

        var shipPosition = this.ship.body.body.position;
        var seedSystem = Game.univers[Game.currentSystem];

        Game.systemStartTime++;

        /* ------------------------------ Update Camera ----------------------------- */

        this.cameras.main.centerOn(shipPosition.x, shipPosition.y);

        /* ------------------------- Update GameObject Ship ------------------------- */

        this.ship.updateSystem();

        /* ------------------------- Update GameObject Ship ------------------------- */

        this.planet.update();

        /* ------------------------- Update Player Controls ------------------------- */

        Game.player.updateControls(this);

        /* ------------------------- Animations Path Planet ------------------------- */

        // Efface les graphics de la scene
        this.graphicsPlanet.clear();

        if (this.systemSceneIsLoaded) {
            // Pour chaque Planet de ce system
            for (var p = 0; p < this.currentSystemPlanets.length; p++) {
                // Dessine le chemin de Planet
                this.graphicsPlanet.lineStyle(
                    1,
                    seedSystem.system[p].color,
                    0.4
                );
                this.currentSystemPaths[p].draw(this.graphicsPlanet, 96);
                // Anime la Planet sur le Chemin
                var t = this.currentSystemPlanets[p].bodyPlanet.z;
                var vec =
                    this.currentSystemPlanets[p].bodyPlanet.getData('vector');
                this.currentSystemPaths[p].getPoint(t, vec);
                this.currentSystemPlanets[p].bodyPlanet.setPosition(
                    vec.x,
                    vec.y
                );
            }
        }

        /* -------------------------- Animations Satellites ------------------------- */

        if (this.systemSceneIsLoaded) {
            for (var s = 0; s < this.currentSystemPlanets.length; s++) {
                if (seedSystem.system[s].satellites[0] !== 'none') {
                    this.currentSystemSatCurves[s].x =
                        this.currentSystemPlanets[s].bodyPlanet.x;
                    this.currentSystemSatCurves[s].y =
                        this.currentSystemPlanets[s].bodyPlanet.y;
                    this.currentSystemSatCurves[s].draw(
                        this.graphicsPlanet,
                        32
                    );
                }
                this.currentSystemPlanets[s].bodyPlanet.rotation +=
                    seedSystem.system[s].speed / 3000000;
            }
        }

        // }

        /* ----------------------- Animation Text Info Planet ----------------------- */

        if (this.systemSceneIsLoaded) {
            if (Game.selectedPlanetOnOver) {
                // Calcule la distance Ship - Planet
                // var distanceX = Math.abs(currentShip.x - selectedPlanetOnOver.x);
                // var distanceY = Math.abs(currentShip.y - selectedPlanetOnOver.y);
                // var distance = distanceX + distanceY;
                var distance = Helpers.getDistanceBetween(
                    this.ship.body,
                    Game.selectedPlanetOnOver
                );
                // Récupère le nom du Satellite
                // var sat = world[currentSystem].systemSeed[selectedPlanetOnOver.data.list.id].satellites[0].name;
                // if (sat === undefined) {
                //   sat = 'Aucun';
                // }
                // Positionne le texte en suivant la Planet selectionnée
                this.infoPlanetTxt.setPosition(
                    Game.selectedPlanetOnOver.x + 20,
                    Game.selectedPlanetOnOver.y + 10
                );
                // Définit le texte à afficher dans infoPlanet
                // if (sat !== 'Aucun') {
                this.infoPlanetTxt.setText(
                    'Planet: ' +
                        Game.selectedPlanetOnOver.data.list.name +
                        '\nDistance: ' +
                        distance.toFixed(0) +
                        '\nMass: ' +
                        Game.selectedPlanetOnOver.data.list.mass +
                        '\nSpeed: ' +
                        Game.selectedPlanetOnOver.data.list.speed +
                        // '\nSatellite: ' + sat +
                        '\nVisited: ' +
                        Game.selectedPlanetOnOver.data.list.visited
                );
                // } else {
                // infoPlanetTxt.setText(
                // 'Planet: ' + selectedPlanetOnOver.data.list.name +
                // '\nDistance: ' + distance.toFixed(2) +
                // '\nMass: ' + world[currentSystem].systemSeed[selectedPlanetOnOver.data.list.id].mass +
                // '\nSpeed: ' + world[currentSystem].systemSeed[selectedPlanetOnOver.data.list.id].speed +
                // '\nVisited: ' + world[currentSystem].systemSeed[selectedPlanetOnOver.data.list.id].visited
                // );
                // }
            }
        }

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

export default SystemScene;
