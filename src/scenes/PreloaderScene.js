/* ========================================================================== */
/*                                                                            */
/*                              PRELOADER - SCENE                             */
/*                                                                            */
/* ========================================================================== */

import * as Setup from '../setup';

import shipAnimations from '../animations/shipAnimations';
import geyserAnimations from '../animations/geyserAnimations';

class PreloaderScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'PreloaderScene',
            pack: {
                files: [{
                    type: 'image',
                    key: 'logo',
                    url: './assets/img/ui/logo.png'
                }]
            }
        });
    }

    /* ========================================================================== */
    /*                             SET PRELOAD SPRITE                             */
    /* ========================================================================== */

    setPreloadSprite(sprite) {
        // Configure l'image de chargement
        this.preloadSprite = {
            sprite: sprite,
            width: sprite.width,
            height: sprite.height
        };
        sprite.visible = true;

        // Définit un callBack pour onProgress
        this.load.on('progress', this.onProgress, this);
        //this.load.on('fileprogress', this.onFileProgress, this);
    }

    /* ========================================================================== */
    /*                                 ON PROGRESS                                */
    /* ========================================================================== */

    onProgress(value) {
        if (this.preloadSprite) {
            // Calcule la hauteur (0.0 - 1.0)
            let h = Math.floor(this.preloadSprite.height * value);

            // Hauteur du Sprite		
            this.preloadSprite.sprite.frame.height = h;
            this.preloadSprite.sprite.frame.cutHeight = h;

            // Mets à jour l'image
            this.preloadSprite.sprite.frame.updateUVs();
        }
    }

    /* ========================================================================== */
    /*                                   PRELOAD                                  */
    /* ========================================================================== */

    preload() {

        /* --------------------------- Fichiers à charger --------------------------- */

        /* --------------------------------- IMAGES --------------------------------- */

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

        /* ------------------------------- SRITESHEETS ------------------------------ */

        this.load.spritesheet('ship', './assets/img/sprites/shipAnim.png', {
            frameWidth: 300,
            frameHeight: 450
        });
        this.load.spritesheet('geyser', './assets/img/sprites/geyser.png', {
            frameWidth: 150,
            frameHeight: 200
        });

        /* --------------------------------- SOUNDS --------------------------------- */

        this.load.audio('intro', ['./assets/snd/intro.mp3', './assets/snd/intro.vaw']);
        this.load.audio('soundThruster', ['./assets/snd/thrust.mp3', './assets/snd/thrust.vaw']);
        this.load.audio('impactShipNormal', ['./assets/snd/impactShipNormal.mp3', './assets/snd/impactShipNormal.vaw']);
        this.load.audio('pump', ['./assets/snd/pump.mp3', './assets/snd/pump.vaw']);
        this.load.audio('airSteam', ['./assets/snd/airSteam.mp3', './assets/snd/airSteam.vaw']);
        this.load.audio('robotMove', ['./assets/snd/robotMove.mp3', './assets/snd/robotMove.vaw']);
        
        // Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        /* -------------------------------- Preloader ------------------------------- */

        // Affiche la barre de chargement graphique
        this.loadingbar_bg = this.add.sprite(Setup.ORIGIN_X, Setup.ORIGIN_Y - 60, "logo").setTint(0xdc324a);
        this.loadingbar_fill = this.add.sprite(Setup.ORIGIN_X, Setup.ORIGIN_Y - 60, "logo").setTint(0xdc324a);
        this.setPreloadSprite(this.loadingbar_fill);

        // Pour voir le preloader graphiquement (actif en devMod)
        if (Setup.DEVMOD == true) {
            for (var i = 0; i < 100; i++) {
                this.load.image('testloading' + i, './assets/img/ui/logo.png');
            };
        }


    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {
        // Charge les animations du Ship
        shipAnimations(this);
        // Charge les animations de Geyser
        geyserAnimations(this);
        // Vide le preload
        this.preloadSprite = null;
        // Démarre la scene de départ
        this.scene.start('MenuScene');
    }
}

export default PreloaderScene;
