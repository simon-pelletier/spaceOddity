/* ========================================================================== */
/*                                                                            */
/*                              SHIP - GAMEOBJECT                             */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

export default class Ship extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.x, config.y, config.key, config.seed, config.size, config.env);
        var scene = config.scene;
        var self = this;

        this.isLanding = false;
        this.landingGear = false;
        this.isLanded = false;
        this.altitude = 0;

        this.isLandedRight = false;
        this.isLandedLeft = false;

        this.size = config.size;
        this.env = config.env;

        /*this.seed = config.seed;
        this.name = this.seed.name;
        this.size = this.seed.size / 20;
        this.distance = this.seed.distanceToStar;
        this.mass = this.seed.mass;
        this.speed = this.seed.speed;
        this.offset = this.seed.offset;
        this.color = this.seed.color;
        this.satellites = this.seed.satellites;
        this.materials = this.seed.materials;
        this.visited = this.seed.visited;*/

        /* ---------------------------------- BODY ---------------------------------- */

        // Bodies Matter Déclaration
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        // Prépare le body Ship
        var shipBody = Bodies.rectangle(0, 80, 160, 300, {
            label: "shipBody"
        });
        var circleA = Bodies.circle(-120, 50, 30, {
            isSensor: true,
            label: "left"
        });
        var circleB = Bodies.circle(0, -110, 40, {
            isSensor: true,
            label: "top"
        });
        var circleC = Bodies.circle(120, 50, 30, {
            isSensor: true,
            label: 'right'
        });
        var circleD = Bodies.circle(-100, 230, 20, {
            isSensor: true,
            label: 'bottomL'
        });
        var circleE = Bodies.circle(100, 230, 20, {
            isSensor: true,
            label: 'bottomR'
        });
        var circleF = Bodies.circle(0, 400, 40, {
            isSensor: true,
            label: 'bottomM'
        });
        var circleG = Bodies.circle(0, -550, 4, {
            isSensor: true,
            label: 'sizer'
        });
        var circleH = Bodies.circle(0, 150, 20, {
            isSensor: true,
            label: 'thruster'
        });
        var compoundBodyShip = Phaser.Physics.Matter.Matter.Body.create({
            parts: [shipBody, circleA, circleB, circleC, circleD, circleE, circleF, circleG, circleH],
            label: 'shipBodyCompound',
            ignoreGravity: true
        });

        // Ajout du Sprite GO SHIP
        this.body = scene.matter.add.sprite(config.x, config.y, config.key);

        // Attribut le body
        this.body.setExistingBody(compoundBodyShip);

        // Configure le Ship Body
        this.body.setScale(this.size);
        this.body.setStatic(false);

        // Position du Ship
        this.body.x = config.x;
        this.body.y = config.y;

        /* --------------------------------- SOUNDS --------------------------------- */

        // Ajout du son de Thrusters
        this.soundThrusterTop = scene.sound.add('soundThruster');
        this.soundThrusterTop.volume = 0.5;
        this.soundThrusterTop.loop = true;
        this.soundThrusterBottom = scene.sound.add('soundThruster');
        this.soundThrusterBottom.volume = 0.8;
        this.soundThrusterBottom.loop = true;
        this.soundThrusterRight = scene.sound.add('soundThruster');
        this.soundThrusterRight.volume = 0.5;
        this.soundThrusterRight.loop = true;
        this.soundThrusterLeft = scene.sound.add('soundThruster');
        this.soundThrusterLeft.volume = 0.5;
        this.soundThrusterLeft.loop = true;

        // Ajout du son de Pompe
        this.soundPump = scene.sound.add('pump');
        this.soundPump.volume = 0.5;
        this.soundPump.loop = true;

        // Ajout du son AirSteam
        this.soundAirSteam = scene.sound.add('airSteam');
        this.soundAirSteam.volume = 0.5;
        this.soundAirSteam.loop = false;

        // Ajout du son AirSteam
        this.soundRobotMove = scene.sound.add('robotMove');
        this.soundRobotMove.volume = 0.5;
        this.soundRobotMove.loop = false;

        /* -------------------------------- CONTROLS -------------------------------- */

        // Appel la fonction controls
        this.controls(scene, self);

        /* -------------------------------- PARTICLES ------------------------------- */

        // Ajoute des particules au Ship
        this.containerFireParticles = scene.add.container(0, 0);
        this.containerSmokeParticles = scene.add.container(0, 0);

        this.fire = scene.add.particles('fire');
        this.fireEmitter = this.fire.createEmitter({
            x: 0,
            y: 15,
            speed: {
                min: 100,
                max: 300
            },
            //angle: 90,
            angle: {
                min: 80,
                max: 100
            },
            scale: {
                start: 0, //0
                end: 0.3, //0.6
                ease: 'Back.easeOut'
            },
            alpha: {
                start: 1,
                end: 0,
                ease: 'Quart.easeOut'
            },
            blendMode: 'SCREEN',
            lifespan: 300 //300
        });

        this.darkSmoke = scene.add.particles('smokeDark').createEmitter({
            x: 0,
            y: 0,
            speed: {
                min: 50,
                max: 70
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 0.2,
                end: 0.4
            },
            alpha: {
                start: 0.3,
                end: 0.1
            },
            lifespan: 0, //600
            follow: this.containerSmokeParticles
        });

        this.whiteSmoke = scene.add.particles('smokeWhite').createEmitter({
            x: 0,
            y: 0,
            speed: {
                min: 30,
                max: 50
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 0.2, //0.3
                end: 0.5 // 0.5
            },
            alpha: {
                start: 0.2,
                end: 0
            },
            lifespan: 0, //600
            follow: this.containerSmokeParticles
        });

        this.containerFireParticles.add([this.fire]);

        return this;
    }

    /* ========================================================================== */
    /*                                UPDATE PLANET                               */
    /* ========================================================================== */

    updatePlanet(keys, time, delta) {

        /* -------------------------------- CONTROLS -------------------------------- */

        // Déplacements avec les touches directionnelles
        if (this.keyUp.isDown) {
            this.body.thrustLeft(0.003);
            Game.player.consumeFuel(0.2);
        } else if (this.keyDown.isDown) {
            this.body.thrustRight(0.001);
            Game.player.consumeFuel(0.2);
        }
        // Déplacement avec les touches ZSQD
        if (this.keyRight.isDown) {
            this.body.setAngularVelocity(0.02);
            Game.player.consumeFuel(0.2);
        } else if (this.keyLeft.isDown) {
            this.body.setAngularVelocity(-0.02);
            Game.player.consumeFuel(0.2);
        }

        /* ------------------------------- ANIMATIONS ------------------------------- */

        // Landing Gear Anims
        if (this.altitude - 400 > 500) {
            this.isLanding = false;
            if (this.landingGear == true) {
                this.landingGear = false;
                this.soundRobotMove.play();
                this.body.anims.play('landingGearShipOff', true);
            }
        } else {
            this.isLanding = true;
            if (this.landingGear == false) {
                this.landingGear = true;
                this.soundRobotMove.play();
                this.body.anims.playReverse('landingGearShipOn', true);
            }
        }

        if (this.isLandedLeft == true && this.isLandedRight == true) {
            if (!this.isLanded) {
                this.isLanded = true;
                this.soundAirSteam.play();
                this.body.anims.play('landingShip', true);
            }
            this.body.setFrictionAir(0.2);
        }

        /* -------------------------------- PATICLES -------------------------------- */

        if (this.keyUp.isDown) {
            this.fireEmitter.lifespan.propertyValue = 400;
            this.whiteSmoke.lifespan.propertyValue = 600;
            this.darkSmoke.lifespan.propertyValue = 600;
            this.whiteSmoke.on = true;
            this.darkSmoke.on = true;

        } else {
            this.fireEmitter.lifespan.propertyValue = 0;
            this.whiteSmoke.lifespan.propertyValue = 0;
            this.darkSmoke.lifespan.propertyValue = 0;
            this.whiteSmoke.on = false;
            this.darkSmoke.on = false;
        }

        this.containerSmokeParticles.setPosition(this.body.body.parts[7].position.x, this.body.body.parts[7].position.y);
        this.containerFireParticles.setPosition(this.body.body.parts[9].position.x, this.body.body.parts[9].position.y);
        this.containerFireParticles.setAngle(this.body.angle);

    }

    /* ========================================================================== */
    /*                                UPDATE SYSTEM                               */
    /* ========================================================================== */

    updateSystem(keys, time, delta) {

        /* -------------------------------- CONTROLS -------------------------------- */

        // Déplacements avec les touches directionnelles
        if (this.keyUp.isDown) {
            this.body.thrustLeft(0.0001);
            Game.player.consumeFuel(0.2);
        } else if (this.keyDown.isDown) {
            this.body.thrustRight(0.0001);
            Game.player.consumeFuel(0.2);
        }
        // Déplacement avec les touches ZSQD
        if (this.keyRight.isDown) {
            this.body.setAngularVelocity(0.02);
            Game.player.consumeFuel(0.2);
        } else if (this.keyLeft.isDown) {
            this.body.setAngularVelocity(-0.02);
            Game.player.consumeFuel(0.2);
        }

        /* ----------------------------- Infinite Scene ----------------------------- */

        var zoneLimit = 300;
        if (this.body.x < -zoneLimit) {
            this.body.x = Setup.WIDTH + zoneLimit;
        }
        if (this.body.x > (Setup.WIDTH + zoneLimit)) {
            this.body.x = -zoneLimit;
        }
        if (this.body.y < -zoneLimit) {
            this.body.y = Setup.HEIGHT + zoneLimit;
        }
        if (this.body.y > (Setup.HEIGHT + zoneLimit)) {
            this.body.y = -zoneLimit;
        }

        /* -------------------------------- PATICLES -------------------------------- */

        if (this.keyUp.isDown) {
            this.fireEmitter.lifespan.propertyValue = 400;
            this.whiteSmoke.lifespan.propertyValue = 600;
            this.darkSmoke.lifespan.propertyValue = 600;
            this.whiteSmoke.on = true;
            this.darkSmoke.on = true;

        } else {
            this.fireEmitter.lifespan.propertyValue = 0;
            this.whiteSmoke.lifespan.propertyValue = 0;
            this.darkSmoke.lifespan.propertyValue = 0;
            this.whiteSmoke.on = false;
            this.darkSmoke.on = false;

        }
        this.containerSmokeParticles.setPosition(this.body.body.parts[7].position.x, this.body.body.parts[7].position.y);
        this.containerFireParticles.setPosition(this.body.body.parts[9].position.x, this.body.body.parts[9].position.y);
        this.containerFireParticles.setAngle(this.body.angle);

    }

    /* ========================================================================== */
    /*                                  CONTROLS                                  */
    /* ========================================================================== */

    controls(scene, self) {
        /* -------------------------------- CONTROLS -------------------------------- */

        // Input Keys
        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        //keyExtract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        //keyCraftHsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        //keyCraftFuel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.body.anims.play('upAnimShip');

        // On KeyDown Global
        scene.input.keyboard.on('keydown', function (event) {

            // "Q" ou "D" ou "Z" ou "S" a été pressé
            if ((event.key == 'z' && !self.keyRight.isDown) && (event.key == 'z' && !self.keyLeft.isDown)) {
                // Joue le son du thruster
                self.soundThrusterBottom.play();
                if (self.isLanding) {
                    self.body.anims.play('upAnimShipLanding', true);
                } else {
                    self.body.anims.play('upAnimShip', true);
                }
            }

            if (event.key == 's') {
                self.soundThrusterTop.play();
                if (self.isLanding) {
                    self.body.anims.play('backAnimShipLanding', true);
                } else {
                    self.body.anims.play('backAnimShip', true);
                }
            }

            if (event.key == 'q' && !self.keyUp.isDown) {
                self.soundThrusterLeft.play();
                if (self.isLanding) {
                    self.body.anims.play('leftAnimShipLanding', true);
                } else {
                    self.body.anims.play('leftAnimShip', true);
                }
            }

            if (event.key == 'd' && !self.keyUp.isDown) {
                self.soundThrusterRight.play();
                if (self.isLanding) {
                    self.body.anims.play('rightAnimShipLanding', true);
                } else {
                    self.body.anims.play('rightAnimShip', true);
                }
            }

        });

        scene.input.keyboard.on('keyup', function (event) {

            /*if (event.key == 'e') {
                self.soundPump.stop();
            }*/

            if (!self.keyUp.isDown && !self.keyDown.isDown && !self.keyLeft.isDown && !self.keyRight.isDown) {
                self.soundThrusterBottom.stop();
                self.soundThrusterTop.stop();
                self.soundThrusterLeft.stop();
                self.soundThrusterRight.stop();
            }
            // "Q" ou "D" ou "Z" ou "S" a été relaché
            if (event.key == 'q' || event.key == 'd' || event.key == 'z' || event.key == 's') {
                if (event.key == 'z') {
                    // Stop le son du thruster
                    self.soundThrusterBottom.stop();
                }
                if (event.key == 's') {
                    self.soundThrusterTop.stop();
                }
                if (event.key == 'q') {
                    self.soundThrusterLeft.stop();
                }
                if (event.key == 'd') {
                    self.soundThrusterRight.stop();
                }
                // Joue l'animation IdleShip
                if (self.isLanding) {
                    self.body.anims.play('idleShipLanding', true);
                } else {
                    self.body.anims.play('idleShip', true);
                }

            }

        });
    }

    /* ========================================================================== */
    /*                              COLLISIONS PLANET                             */
    /* ========================================================================== */

    collisionsPlanet(scene, self) {
        /* ------------------------------- COLLISIONS ------------------------------- */

        scene.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {

                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                // SENSORS (SHIP)
                if (bodyA.isSensor || bodyB.isSensor) {

                    // SHIP - PLANET
                    if (bodyA.label === 'planetBody' || bodyB.label === 'planetBody') {
                        // Si la collision concerne le ship de coté
                        if (bodyA.label === 'left' || bodyA.label === 'right' || bodyB.label === 'left' || bodyB.label === 'right') {
                            scene.cameras.main.shake(200, 0.002);
                            //eGtotalDamages += 30;
                            Game.player.takeDamages(20);
                            //shipHealth = shipHealth - 30;
                        }
                        // Si la collision concerne le ship de la pointe avant
                        if (bodyA.label === 'top' || bodyB.label === 'top') {
                            scene.cameras.main.shake(200, 0.005);
                            //eGtotalDamages += 50;
                            Game.player.takeDamages(50);
                            //shipHealth = shipHealth - 50;
                        }
                        // Si la collision concerne le ship sur le train d'atterissage
                        if (bodyA.label === 'bottomR' || bodyB.label === 'bottomR') {
                            //self.body.anims.play('landingShip', true);
                            self.isLandedRight = true;
                        }
                        if (bodyA.label === 'bottomL' || bodyB.label === 'bottomL') {
                            //self.body.anims.play('landingShip', true);
                            self.isLandedLeft = true;
                        }

                    }

                    // SHIP - GEYSER
                    /*if (bodyA.label === 'bottomM' || bodyB.label === 'bottomM') {
                        if (bodyA.label === 'geyserBody' || bodyB.label === 'geyserBody') {
                            if (bodyB.label === 'geyserBody') {
                                currentMaterial = bodyB.data.id;
                                currentMaterialObj = bodyB.gameObject;
                            } else {
                                currentMaterial = bodyA.data.id;
                                currentMaterialObj = bodyA.gameObject;
                            }
                            isOnMaterial = true;
                            console.log('DIG IT !');
                        }
                    }*/

                    // SHIP - BOUNDS
                    if (bodyA.label === 'bounds' || bodyB.label === 'bounds') {
                        self.soundThrusterTop.stop();
                        self.soundThrusterBottom.stop();
                        self.soundThrusterLeft.stop();
                        self.soundThrusterRight.stop();
                        self.currentPlanet = -1;
                        //initializeSystem();
                        //selectedPlanetOnOver = null;
                        // Désactive de témoin du loader de systemScene
                        //systemSceneIsLoaded = false;

                        scene.scene.start('SystemScene');
                    }

                }

            }
        });

        scene.matter.world.on('collisionend', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {

                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                // SENSORS (SHIP)
                if (bodyA.isSensor || bodyB.isSensor) {

                    // SHIP - PLANET
                    if (bodyA.label === 'planetBody' || bodyB.label === 'planetBody') {
                        // Si la collision concerne le ship sur le train d'atterissage
                        if (bodyA.label === 'bottomR' || bodyB.label === 'bottomR') {
                            self.body.setFrictionAir(0.01);
                            self.isLandedRight = false;
                            self.isLanded = false;
                            //console.log('LIFT-OFF !');
                        }
                        if (bodyA.label === 'bottomL' || bodyB.label === 'bottomL') {
                            self.body.setFrictionAir(0.01);
                            self.isLandedLeft = false;
                            self.isLanded = false;
                            //console.log('LIFT-OFF !');
                        }
                    }

                    // SHIP - GEYSER
                    /*if (bodyA.label === 'bottomM' || bodyB.label === 'bottomM') {
                      if (bodyA.label === 'geyserBody' || bodyB.label === 'geyserBody') {
                        currentMaterial = null;
                        currentMaterialObj = null;
                        isOnMaterial = false;
                        console.log('NO MORE ON GEYSER !');
                      }
                    }*/

                }

            }
        });
    }

    /* ========================================================================== */
    /*                              COLLISIONS SYSTEM                             */
    /* ========================================================================== */

    collisionsSystem(scene, self) {
        scene.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
      
              var bodyA = pairs[i].bodyA;
              var bodyB = pairs[i].bodyB;
      
              // Ship - Planet
              if (bodyA.label === 'shipBody' && bodyB.label === 'planetBody') {
                self.soundThrusterTop.stop();
                self.soundThrusterBottom.stop();
                self.soundThrusterLeft.stop();
                self.soundThrusterRight.stop();

                Game.currentPlanet = bodyB.parent.gameObject.data.list.id;
                /*currentPlanet = bodyB.parent.gameObject.data.list.id;
                shipSystemPosition = {
                  x: bodyB.parent.gameObject.x,
                  y: bodyB.parent.gameObject.y
                };*/
      
                // Désactive de témoin du loader de systemScene
                //systemSceneIsLoaded = false;
                scene.scene.start('PlanetScene');
      
              }
              if (bodyB.label === 'shipBody' && bodyA.label === 'planetBody') {
                self.soundThrusterTop.stop();
                self.soundThrusterBottom.stop();
                self.soundThrusterLeft.stop();
                self.soundThrusterRight.stop();

                Game.currentPlanet = bodyA.parent.gameObject.data.list.id;
                /*currentPlanet = bodyA.parent.gameObject.data.list.id;
                shipSystemPosition = {
                  x: bodyA.parent.gameObject.x,
                  y: bodyA.parent.gameObject.y
                };*/
      
                // Désactive de témoin du loader de systemScene
                //systemSceneIsLoaded = false;
                scene.scene.start('PlanetScene');
      
              }
      
              // Ship - Star
              if (bodyA.label === 'shipBody' && bodyB.label === 'starBody') {
                console.log('PERDU : Ton vaisseau a cramé sur une étoile...');
                scene.scene.stop('UiScene');
                scene.scene.start('EndGameScene');
              }
              if (bodyB.label === 'shipBody' && bodyA.label === 'starBody') {
                console.log('PERDU : Ton vaisseau a cramé sur une étoile...');
                scene.scene.stop('UiScene');
                scene.scene.start('EndGameScene');
              }
      
            }
          });
    }

    /* ========================================================================== */
    /*                                   GETTERS                                  */
    /* ========================================================================== */

    getAltitude() {
        return this.altitude;
    }

    /* ========================================================================== */
    /*                                   SETTERS                                  */
    /* ========================================================================== */

    setAltitude(alt) {
        this.altitude = alt;
    }
}