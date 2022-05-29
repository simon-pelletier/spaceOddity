import Game from '../game';
import * as Setup from '../setup';
import { getRandomColor } from '../helpers/helpers';
import * as Helpers from '../helpers/helpers';

export default class Asteroid extends Phaser.GameObjects.GameObject {
    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {
        super(config.scene, config.key);

        var scene = config.scene;
        var self = this;

        this.size = Helpers.getRandomNumberFloat(0.005, 0.02);
        this.mass = Helpers.getRandomNumberFloat(0.5, 3);
        this.speed = Helpers.getRandomNumber(1, 6);
        this.color = Helpers.getRandomColor();

        // Définit le point de Spawn de l'Asteroid
        this.asteroidStart = this.getRandomAsteroidSpawn();

        // Construit le body de l'Asteroid
        var bodyAsteroid = config.scene.matter.add.image(
            this.asteroidStart.x,
            this.asteroidStart.y,
            config.key
        );
        bodyAsteroid.setBody(
            {
                type: 'polygon',
                radius: 100,
                sides: 64
            },
            {
                label: 'asteroidBody'
            }
        );

        // Configure le body de l'Asteroid
        bodyAsteroid.setTint(this.color);
        bodyAsteroid.setScale(this.size);
        bodyAsteroid.setMass(0.2);
        bodyAsteroid.setPosition(this.asteroidStart.x, this.asteroidStart.y);
        bodyAsteroid.setFriction(0.0005);
        bodyAsteroid.setFrictionAir(0.001);
        bodyAsteroid.setBounce(0.2);
        bodyAsteroid.setIgnoreGravity(true);
        bodyAsteroid.setAngularVelocity(-0.02);
        bodyAsteroid.applyForce(Helpers.getRandomVector2(0.001, 0.005));

        // Ajoute des particules à l'asteroid
        this.particles = config.scene.add.particles('smokeWhite');
        this.particles.createEmitter({
            speed: 5,
            quantity: 1,
            lifespan: 200,
            gravity: {
                x: 0,
                y: 0
            },
            scale: {
                start: 0.02,
                end: 0.005
            },
            follow: bodyAsteroid,
            frequency: 0,
            label: 'asteroidParticles'
        });

        // Ajoute le body au gameObject Asteroid
        this.body = bodyAsteroid.body;

        /* --------------------------------- SOUNDS --------------------------------- */
        // Ajout du son de Pompe
        this.soundImpactShipNormal = scene.sound.add('impactShipNormal');
        this.soundImpactShipNormal.volume = 0.5;
        this.soundImpactShipNormal.loop = false;

        /* -------------------------------- PARTICLES ------------------------------- */

        this.particleExplosion = config.scene.add
            .particles('smokeWhite')
            .createEmitter({
                x: 0,
                y: 0,
                //speed: { min: 0, max: 10 },
                //angle: { min: 0, max: 360 },
                scale: {
                    start: 0.5,
                    end: 0
                },
                blendMode: 'SCREEN',
                on: false,
                alpha: {
                    start: 1,
                    end: 0
                },
                lifespan: 1500,
                gravityY: 0
            });

        return this;
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {}

    /* ========================================================================== */
    /*                                 COLLISIONS                                 */
    /* ========================================================================== */

    collisions(scene, self) {
        scene.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                // Asteroid - Star
                if (
                    bodyA.label === 'asteroidBody' &&
                    bodyB.label === 'starBody'
                ) {
                    var asteroidStart = self.getRandomAsteroidSpawn();
                    bodyA.gameObject.setPosition(
                        asteroidStart.x,
                        asteroidStart.y
                    );
                    bodyA.gameObject.applyForce(
                        Helpers.getRandomVector2(0.001, 0.005)
                    );
                    self.particleExplosion.setPosition(
                        pairs[i].collision.axisBody.position.x,
                        pairs[i].collision.axisBody.position.y
                    );
                    self.particleExplosion.explode();
                }
                if (
                    bodyB.label === 'asteroidBody' &&
                    bodyA.label === 'starBody'
                ) {
                    var asteroidStart = self.getRandomAsteroidSpawn();
                    bodyB.gameObject.setPosition(
                        asteroidStart.x,
                        asteroidStart.y
                    );
                    bodyB.gameObject.applyForce(
                        Helpers.getRandomVector2(0.001, 0.005)
                    );
                    self.particleExplosion.setPosition(
                        pairs[i].collision.axisBody.position.x,
                        pairs[i].collision.axisBody.position.y
                    );
                    self.particleExplosion.explode();
                }

                // Asteroid - Planet
                if (
                    bodyA.label === 'asteroidBody' &&
                    bodyB.label === 'planetBody'
                ) {
                    var asteroidStart = self.getRandomAsteroidSpawn();
                    bodyA.gameObject.setPosition(
                        asteroidStart.x,
                        asteroidStart.y
                    );
                    bodyA.gameObject.applyForce(
                        Helpers.getRandomVector2(0.001, 0.005)
                    );
                    self.particleExplosion.setPosition(
                        pairs[i].collision.axisBody.position.x,
                        pairs[i].collision.axisBody.position.y
                    );
                    self.particleExplosion.explode();
                }
                if (
                    bodyB.label === 'asteroidBody' &&
                    bodyA.label === 'planetBody'
                ) {
                    var asteroidStart = self.getRandomAsteroidSpawn();
                    bodyB.gameObject.setPosition(
                        asteroidStart.x,
                        asteroidStart.y
                    );
                    bodyB.gameObject.applyForce(
                        Helpers.getRandomVector2(0.001, 0.005)
                    );
                    self.particleExplosion.setPosition(
                        pairs[i].collision.axisBody.position.x,
                        pairs[i].collision.axisBody.position.y
                    );
                    self.particleExplosion.explode();
                }

                // Asteroid - Ship
                if (
                    bodyA.label === 'asteroidBody' &&
                    bodyB.label === 'shipBody'
                ) {
                    self.soundImpactShipNormal.play();
                    self.particleExplosion.setPosition(
                        pairs[i].collision.axisBody.position.x,
                        pairs[i].collision.axisBody.position.y
                    );
                    self.particleExplosion.explode();
                    scene.cameras.main.shake(200, 0.004);
                    Game.player.takeDamages(20);
                    bodyB.parent.gameObject.setAngularVelocity(
                        Helpers.getRandomNumberFloat(-0.5, 0.5)
                    );
                }
                if (
                    bodyB.label === 'asteroidBody' &&
                    bodyA.label === 'shipBody'
                ) {
                    self.soundImpactShipNormal.play();
                    self.particleExplosion.setPosition(
                        pairs[i].collision.axisBody.position.x,
                        pairs[i].collision.axisBody.position.y
                    );
                    self.particleExplosion.explode();
                    scene.cameras.main.shake(200, 0.004);
                    Game.player.takeDamages(20);
                    bodyA.parent.gameObject.setAngularVelocity(
                        Helpers.getRandomNumberFloat(-0.5, 0.5)
                    );
                }
            }
        });
    }

    /* ========================================================================== */
    /*                                    SPAWN                                   */
    /* ========================================================================== */

    getRandomAsteroidSpawn() {
        // Asteroid Position
        var asteroidX = '';
        var asteroidY = '';

        // Asteroid marge haute et basse pour le Spawn
        var lowZone = 200;
        var highZone = 20;

        // Côté sur lequel l'astéroide est positionné
        var side = Helpers.getRandomNumber(0, 3);

        if (side === 0) {
            asteroidX = Helpers.getRandomNumber(-lowZone, -highZone);
            asteroidY = Helpers.getRandomNumber(
                -lowZone,
                Game.canvas.clientHeight + lowZone
            );
        } else if (side === 1) {
            asteroidX = Helpers.getRandomNumber(
                -lowZone,
                Game.canvas.clientWidth + lowZone
            );
            asteroidY = Helpers.getRandomNumber(-lowZone, -highZone);
        } else if (side === 2) {
            asteroidX = Helpers.getRandomNumber(
                Game.canvas.clientWidth + highZone,
                Game.canvas.clientWidth + lowZone
            );
            asteroidY = Helpers.getRandomNumber(
                -lowZone,
                Game.canvas.clientHeight + lowZone
            );
        } else if (side === 3) {
            asteroidX = Helpers.getRandomNumber(
                -lowZone,
                Game.canvas.clientWidth + lowZone
            );
            asteroidY = Helpers.getRandomNumber(
                Game.canvas.clientHeight + highZone,
                Game.canvas.clientHeight + lowZone
            );
        }

        // Position de départ de l'astéroide
        var asteroidStartPoint = {
            x: asteroidX,
            y: asteroidY
        };

        return asteroidStartPoint;
    }
}
