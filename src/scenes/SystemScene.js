/* ========================================================================== */
/*                                                                            */
/*                                SYSTEM SCENE                                */
/*                                                                            */
/* ========================================================================== */

import Game from '../game'

import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

import defaultSceneConfig from '../helpers/sceneConfig';

import Ship from '../objects/Ship';
import Star from '../objects/Star';
import Planet from '../objects/Planet';
import Asteroid from '../objects/Asteroid';

class SystemScene extends Phaser.Scene {
    constructor(test) {
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

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {

        console.log(Game);

        /* ------------------------------ SCENE CONFIG ------------------------------ */

        // Variables Globales
        var self = this;
        this.systemSceneIsLoaded = false;

        // Configure la scene par défaut
        defaultSceneConfig(this);

        var seedSystem = Game.univers[Game.currentSystem];
        var seedPlanet = Game.univers[Game.currentSystem].system[Game.currentPlanet];

        // Active le PlugIn Attractor pour la gravité d'un GameObject
        this.matter.enableAttractorPlugin();

        /* ------------------------------- BACKGROUND ------------------------------- */

        // Background - Ajout de groupe d'étoiles_mini
        this.backGround = this.add.group({
            key: 'starTwoPx',
            frameQuantity: 800
        });

        var starBackGround = new Phaser.Geom.Rectangle(-1000, -1000, Setup.WIDTH + 2000, Setup.HEIGHT + 2000);
        Phaser.Actions.RandomRectangle(this.backGround.getChildren(), starBackGround);

        /* ---------------------------------- TEXTS --------------------------------- */

        // Définit le Style du text systemText
        var styleTextSystem = {
            fontSize: '20px',
            fontFamily: Setup.TYPO,
            color: '#141414',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        };

        // Ajoute le texte systemText
        this.systemText = this.add.text(0, 0, '', styleTextSystem).setPadding(10, 10);
        this.systemText.setDepth(0);
        this.systemText.setPosition(Setup.ORIGIN_X - 500, Setup.ORIGIN_Y - 150);

        this.systemText.setText(
            Game.univers[Game.currentSystem].name
        );

        /* ------------------------------ GAME OBJECTS ------------------------------ */

        // Object Star
        this.star = new Star({
            scene: this,
            x: Setup.ORIGIN_X,
            y: Setup.ORIGIN_Y,
            key: 'star',
            seed: seedSystem.system[0]
        });

        // Object Ship
        this.ship = new Ship({
            scene: this,
            x: Setup.ORIGIN_X - 400,
            y: Setup.ORIGIN_Y,
            key: 'ship',
            size: 0.1,
            env: 'system'
        });

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
            this.path = new Phaser.Curves.Ellipse(Setup.ORIGIN_X, Setup.ORIGIN_Y, this.planet.distance * 2);

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
                this.curveSat = new Phaser.Curves.Ellipse(this.planet.bodyPlanet.x, this.planet.bodyPlanet.y, seedSystem.system[p].satellites[0].distance, seedSystem.system[p].satellites[0].distance, 0, 360, false);
                this.curveSat.draw(this.graphicsPlanet);

                // Ajoute et configure le Satellite
                var sat = this.add.follower(this.curveSat, this.planet.bodyPlanet.x + seedSystem.system[p].satellites[0].distance, this.planet.bodyPlanet.y, 'satellite');
                /*.setInteractive({
                          cursor: 'url(./assets/cursor/alt.cur), pointer'
                        });*/
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
                    repeat: -1,
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

    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

        /* -------------------------------- Variables ------------------------------- */

        var shipPosition = this.ship.body.body.position;
        var seedSystem = Game.univers[Game.currentSystem];

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
                this.graphicsPlanet.lineStyle(1, seedSystem.system[p].color, 0.4);
                this.currentSystemPaths[p].draw(this.graphicsPlanet, 96);
                // Anime la Planet sur le Chemin
                var t = this.currentSystemPlanets[p].bodyPlanet.z;
                var vec = this.currentSystemPlanets[p].bodyPlanet.getData('vector');
                this.currentSystemPaths[p].getPoint(t, vec);
                this.currentSystemPlanets[p].bodyPlanet.setPosition(vec.x, vec.y);
            }
        }

        /* -------------------------- Animations Satellites ------------------------- */

        if (this.systemSceneIsLoaded) {
            for (var s = 0; s < this.currentSystemPlanets.length; s++) {
                if (seedSystem.system[s].satellites[0] !== 'none') {
                    this.currentSystemSatCurves[s].x = this.currentSystemPlanets[s].bodyPlanet.x;
                    this.currentSystemSatCurves[s].y = this.currentSystemPlanets[s].bodyPlanet.y;
                    this.currentSystemSatCurves[s].draw(this.graphicsPlanet, 32);
                }
                this.currentSystemPlanets[s].bodyPlanet.rotation += seedSystem.system[s].speed / 3000000;
            }
        }

    }

}

export default SystemScene;