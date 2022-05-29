import * as Setup from '../setup';
import Game from '../game';

import shipAnimations from '../animations/shipAnimations';
import geyserAnimations from '../animations/geyserAnimations';
import rawMatAnimations from '../animations/rawMatAnimations';

class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreloaderScene',
            pack: {
                files: [
                    {
                        type: 'image',
                        key: 'logo',
                        url: './assets/img/ui/logo.png'
                    }
                ]
            }
        });
    }

    /**
     * Sprite preloader
     * @param {object} sprite
     */
    setPreloadSprite(sprite) {
        // Configure the loading image
        this.preloadSprite = {
            sprite: sprite,
            width: sprite.width,
            height: sprite.height
        };
        sprite.visible = true;

        // Define a callBack for onProgress
        this.load.on('progress', this.onProgress, this);
    }

    /**
     * On progress loading
     * @param {number} value
     */
    onProgress(value) {
        if (this.preloadSprite) {
            // Calculate height (0.0 - 1.0)
            let h = Math.floor(this.preloadSprite.height * value);

            // Sprite height
            this.preloadSprite.sprite.frame.height = h;
            this.preloadSprite.sprite.frame.cutHeight = h;

            // Image update
            this.preloadSprite.sprite.frame.updateUVs();
        }
    }

    preload() {
        //* IMAGES

        this.load.image('logo', './assets/img/ui/logo.png');
        this.load.image('play', './assets/img/ui/play.png');

        this.load.image('starOnePx', './assets/img/starOnePx.png');
        this.load.image('starTwoPx', './assets/img/starTwoPx.png');

        this.load.image('star', './assets/img/star.png');
        this.load.image('planet', './assets/img/planet.png');
        this.load.image('satellite', './assets/img/satellite.png');
        this.load.image('asteroid', './assets/img/asteroid.png');

        this.load.image('smokeDark', './assets/img/smokeDark.png');
        this.load.image('smokeWhite', './assets/img/smokeWhite.png');
        this.load.image('fire', './assets/img/fire.png');

        // Ui parts
        this.load.image('needle', './assets/img/ui/needle.png');
        this.load.image('needleH', './assets/img/ui/needleH.png');
        this.load.image('ui_base', './assets/img/ui/ui_base.png');
        this.load.image('hscBulb', './assets/img/ui/hscBulb.png');

        //* SRITESHEETS

        this.load.spritesheet('ship', './assets/img/sprites/shipAnim.png', {
            frameWidth: 300,
            frameHeight: 450
        });
        this.load.spritesheet('geyser', './assets/img/sprites/geyser.png', {
            frameWidth: 150,
            frameHeight: 200
        });
        this.load.spritesheet('rawMat', './assets/img/sprites/rawMat.png', {
            frameWidth: 200,
            frameHeight: 100
        });

        //* SOUNDS

        this.load.audio('intro', [
            './assets/snd/intro.mp3',
            './assets/snd/intro.vaw'
        ]);
        this.load.audio('soundThruster', [
            './assets/snd/thrust.mp3',
            './assets/snd/thrust.vaw'
        ]);
        this.load.audio('impactShipNormal', [
            './assets/snd/impactShipNormal.mp3',
            './assets/snd/impactShipNormal.vaw'
        ]);
        this.load.audio('pump', [
            './assets/snd/pump.mp3',
            './assets/snd/pump.vaw'
        ]);
        this.load.audio('airSteam', [
            './assets/snd/airSteam.mp3',
            './assets/snd/airSteam.vaw'
        ]);
        this.load.audio('robotMove', [
            './assets/snd/robotMove.mp3',
            './assets/snd/robotMove.vaw'
        ]);
        this.load.audio('welding', [
            './assets/snd/welding.mp3',
            './assets/snd/welding.vaw'
        ]);
        this.load.audio('drill', [
            './assets/snd/drill.mp3',
            './assets/snd/drill.vaw'
        ]);

        //* FONTS

        this.load.script(
            'webfont',
            'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
        );

        //* PRELOADER

        // Displays the graphical loading bar
        this.loadingbar_bg = this.add
            .sprite(
                Game.canvas.clientWidth / 2,
                Game.canvas.clientHeight / 2 - 60,
                'logo'
            )
            .setTint(0xdc324a);
        this.loadingbar_fill = this.add
            .sprite(
                Game.canvas.clientWidth / 2,
                Game.canvas.clientHeight / 2 - 60,
                'logo'
            )
            .setTint(0xdc324a);
        this.setPreloadSprite(this.loadingbar_fill);

        // To see the preloader graphically (active in devMod)
        if (Setup.DEVMOD === true) {
            for (var i = 0; i < 100; i++) {
                this.load.image('testloading' + i, './assets/img/ui/logo.png');
            }
        }
    }

    create() {
        // Load Ship animations
        shipAnimations(this);
        // Loads Geyser Animations
        geyserAnimations(this);
        // Load RawMat animations
        rawMatAnimations(this);
        // Empty the preload
        this.preloadSprite = null;
        // Start the starting scene or the Dev Scene if DevMod
        if (Setup.DEVMOD === true) {
            console.log('Setup.DEVSCENE', Setup.DEVSCENE);
            this.scene.start(Setup.DEVSCENE);
        } else {
            this.scene.start('MenuScene');
        }
    }
}

export default PreloaderScene;
