/* ========================================================================== */
/*                                                                            */
/*                              HIGH SPEED SCENE                              */
/*                                                                            */
/* ========================================================================== */

import * as Setup from '../setup';

class HighSpeedScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'HighSpeedScene'
        });
    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {
        var self = this;

        /* ---------------------------- SCENE MANAGEMENT ---------------------------- */

        this.scene.sleep('UiScene');
        this.scene.stop('SystemScene');

        /* --------------------------------- SOUNDS --------------------------------- */

        this.soundThrusterTop = this.sound.add('soundThruster');
        this.soundThrusterTop.loop = true;
        this.soundThrusterTop.volume = 0.4;
        this.soundThrusterTop.play();

        /* ------------------------------ GAME OBJECTS ------------------------------ */

        // Bodies Matter Déclaration
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        // Prépare le body Ship
        var shipBody = Bodies.rectangle(0, 80, 160, 300, {
            label: "shipBody"
        });

        var compoundBodyShip = Phaser.Physics.Matter.Matter.Body.create({
            parts: [shipBody],
            label: 'shipBodyCompound'
        });

        // Ajoute et configure le point (Ship) qui parcours la lineHS
        this.shipHighSpeed = this.matter.add.sprite(Setup.ORIGIN_X - 200, Setup.ORIGIN_Y, 'ship', null, {
            isStatic: false,
            ignorePointer: true,
            ignoreGravity: true
        });
        this.shipHighSpeed.setExistingBody(compoundBodyShip);
        this.shipHighSpeed.setIgnoreGravity(true);
        this.shipHighSpeed.setScale(0.8);
        this.shipHighSpeed.setDepth(10);
        this.shipHighSpeed.setAngle(90 + 180);
        this.shipHighSpeed.setPosition(Setup.ORIGIN_X - 200, Setup.ORIGIN_Y);
        this.shipHighSpeed.anims.play('upAnimShip');
        this.shipHighSpeed.setFlipY(true);

        /* -------------------------------- PARALLAX -------------------------------- */

        var offscreen = new Phaser.Geom.Rectangle(0, 0, 1600, 600);
        var screen = new Phaser.Geom.Rectangle(0, 0, 1600, 600);

        var parallax = this.add.particles('starTwoPx', [{
                emitZone: {
                    source: offscreen
                },
                deathZone: {
                    source: screen,
                    type: 'onLeave'
                },
                frequency: 100,
                speedX: {
                    min: -80,
                    max: -120
                },
                lifespan: 30000,
                scale: 0.5,

            },
            {
                emitZone: {
                    source: offscreen
                },
                deathZone: {
                    source: screen,
                    type: 'onLeave'
                },
                frequency: 150,
                speedX: {
                    min: -180,
                    max: -220
                },
                lifespan: 30000,
                scale: 0.8,

            },
            {
                emitZone: {
                    source: offscreen
                },
                deathZone: {
                    source: screen,
                    type: 'onLeave'
                },
                frequency: 500,
                quantity: 4,
                speedX: {
                    min: -280,
                    max: -320
                },
                lifespan: 30000,

            },
        ]);

        /* ------------------------------- ANIMATIONS ------------------------------- */

        setTimeout(function () {

            parallax.emitters.list.forEach((e, index) => {
                e.speedX.start = -15000;
                e.alive.forEach((e, index) => {
                    e.velocityX = -10000;
                });
            });
            self.shipHighSpeed.anims.play('upAnimShip');
            self.shipHighSpeed.setVelocityX(3);
            self.soundThrusterTop.volume = 1;
            self.soundThrusterTop.play();
        }, 3000);

        setTimeout(function () {
            parallax.emitters.list.forEach((e, index) => {
                e.speedX.start = -320;
                e.alive.forEach((e, index) => {
                    e.velocityX = -180;
                });
            });
            self.shipHighSpeed.anims.play('upAnimShip');
            self.soundThrusterTop.volume = 0.5;
        }, 6000);

        setTimeout(function () {
            parallax.emitters.list.forEach((e, index) => {
                e.speedX.start = 0;
                e.frequency = 10000;
                e.alive.forEach((e, index) => {
                    e.velocityX = 0;
                });
            });
            self.shipHighSpeed.anims.play('idleShip', true);
            self.soundThrusterTop.stop();
        }, 7000);

        setTimeout(function () {
            self.tweens.add({
                targets: self.shipHighSpeed,
                scaleX: 0.3,
                scaleY: 0.3,
                ease: 'Linear',
                duration: 1000,
            });
            // Lance la scene System
            self.scene.start('SystemScene');
        }, 8000);

    }

}

export default HighSpeedScene;
