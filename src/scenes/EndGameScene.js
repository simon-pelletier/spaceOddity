/* ========================================================================== */
/*                                                                            */
/*                               END GAME SCENE                               */
/*                                                                            */
/* ========================================================================== */

import * as Setup from '../setup';

class EndGameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'EndGameScene'
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
        this.musicIntro = this.sound.add('intro');
        this.musicIntro.volume = 0.5;
        this.musicIntro.loop = true;
        this.musicIntro.play();

        /* ---------------------------------- TEXTS --------------------------------- */

        // Définit le Style du text infoPlanetTxt
        var styleText = {
            align: 'center',
            fontSize: '20px',
            fontFamily: Setup.TYPO,
            color: '#ffffff',
            //backgroundColor: 'rgba(0, 0, 0, 0.8)'
        };

        // Ajoute le texte endGameTxt
        this.endGameTxt = this.add.text(Setup.ORIGIN_X, Setup.ORIGIN_Y, '', styleText).setPadding(100, 100);
        this.endGameTxt.setDepth(20);


        // Temps de jeu en minutes (depuis la création de l'ui)
        //var time = eGtotalTime / 60000;

        // Calcule le score
        //var score = ((time / 10) + 1) * ((eGtotalDistance * (eGtotalHSCJumps + 1)) + eGvisitedSystems + eGvisitedPlanets + eGpumpedFuel + eGconsumedFuel + eGconsumedHSC + (eGtotalCollisions * (eGtotalDamages + 1)));

        // Définit le contenu de endGameTxt
        this.endGameTxt.setText(
            'fin de jeu'
            /*'Total time: ' + time.toFixed(2) + ' min' +
            '\nTotal distance: ' + eGtotalDistance +
            '\nHigh-Speed Jumps: ' + eGtotalHSCJumps.toFixed(0) +
            '\nVisited Systems: ' + eGvisitedSystems +
            '\nVisited Planets: ' + eGvisitedPlanets +
            '\n\nPumped fuel: ' + eGpumpedFuel.toFixed(0) +
            '\nConsumed fuel: ' + eGconsumedFuel.toFixed(0) +
            '\nConsumed HSC: ' + eGconsumedHSC.toFixed(0) +
            '\nTotal collisions: ' + eGtotalCollisions.toFixed(0) +
            '\nTotal damages: ' + eGtotalDamages.toFixed(0) +
            '\n\nSCORE: ' + score.toFixed(0)*/
        );

        this.endGameTxt.setPosition(Setup.ORIGIN_X - this.endGameTxt.width / 2, Setup.ORIGIN_Y - this.endGameTxt.height / 2);
        this.endGameTxt.setInteractive({
            cursor: 'url(./assets/cursor/select.cur), pointer'
        });

        /*endGameTxt.on('pointerdown',
            this.doStart.bind(this)
        );*/
        this.endGameTxt.on('pointerdown', this.doReStart.bind(this));

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
    /*                                 MENU START                                 */
    /* ========================================================================== */

    doReStart() {
        // Stoppe la musique d'intro
        this.musicIntro.stop();
        // Lance la scene de menus
        this.scene.start('MenuScene');
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

    }

}

export default EndGameScene;
