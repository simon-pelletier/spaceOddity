/* ========================================================================== */
/*                                                                            */
/*                                 FIGHT SCENE                                */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

class FightScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'FightScene'
        });
    }

    /* ========================================================================== */
    /*                                   PRELOAD                                  */
    /* ========================================================================== */

    preload() {

    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {
        /* ------------------------------ CONFIGURATION ----------------------------- */

        // Variables Globales
        var self = this;

        /* --------------------------------- SOUNDS --------------------------------- */

        // Lance la musique de fin
        /*this.musicIntro = this.sound.add('intro');
        this.musicIntro.volume = 0.5;
        this.musicIntro.loop = true;
        this.musicIntro.play();*/

        /* ------------------------------- BACKGROUND ------------------------------- */

        // Background - Ajout de groupe d'étoiles_mini
        var bg = this.add.group({
            key: 'starTwoPx',
            frameQuantity: 150
        });

        // Création des étoiles_mini
        var rect = new Phaser.Geom.Rectangle(0, 0, Setup.WIDTH, Setup.HEIGHT);
        Phaser.Actions.RandomRectangle(bg.getChildren(), rect);

        /* --------------------------------- BOUNDS --------------------------------- */

        // Définit les bords de la scene en colliders
        this.matter.world.setBounds();

        /* -------------------------------- CONTROLS -------------------------------- */

        // Définit le pointer par défault
        this.input.setDefaultCursor('url(./assets/cursor/normal.cur), pointer');
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

    }

}

export default FightScene;
