/* ========================================================================== */
/*                                                                            */
/*                                  UI SCENE                                  */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';

import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

class UiScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'UiScene'
        });
    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {

        // Définit le Style du text infoPlanetTxt
        var styleText = {
            fontSize: '18px',
            align: 'center',
            fontFamily: Setup.TYPO,
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
        };

        // Ajoute le texte uiText
        this.uiText = this.add.text(0, 0, '', styleText).setPadding(20, 20);

        this.uiText.setDepth(30);
        this.uiText.setPosition(0, 0);

        // Définit le Style du text infoPlanetTxt
        var helpStyleText = {
            fontSize: '17px',
            fontFamily: Setup.TYPO,
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
        };

        // Ajoute le texte helpText
        this.helpText = this.add.text(100, 200, '', helpStyleText).setPadding(10, 10);
        this.helpText.setDepth(30);

        this.helpText.setText(
            '[M]ap' +
            '\n[E]xtract resources' +
            '\n[R]epair Ship' +
            '\nCraft 1 [H]SC for 1K Fuel' +
            '\nCraft 1K [F]uel for 1 HSC'
        );

        /* ----------------------------- Ajoute un TImer ---------------------------- */

        this.globalTimer = this.time.addEvent({
            //delay: 500, // ms
            //callback: callback,
            //args: [],
            //callbackScope: thisArg,
            loop: true
        });

    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

        this.helpText.setPosition(1200 - this.helpText.displayWidth, 0);

        if (Game.currentScene == 'Planet') {
            // Mise à jour du contenu du Text uiText
            this.uiText.setText(
                'HEALTH: ' + Game.player.getHealth().toFixed(0) +
                '\n\nSPEED: ' + Game.ship.body.body.speed.toFixed(0) +
                '\n\nALT: ' + Game.ship.getAltitude().toFixed(0) +
                '\n\nGRAVITY: ' + (Game.univers[Game.currentSystem].system[Game.currentPlanet].gravity * 10).toFixed(1) +
                '\n\nFUEL: ' + Game.player.getFuel().toFixed(0) +
                '\n\nHSC: ' + Game.player.getHsc() +
                '\n\nRAW-MAT: ' + Game.player.getRawMat()
            );
        } else {
            // Mise à jour du contenu du Text uiText
            this.uiText.setText(
                'HEALTH: ' + Game.player.getHealth().toFixed(0) +
                '\n\nSPEED: ' + Game.ship.body.body.speed.toFixed(0) +
                '\n\nGRAVITY: 0' +
                '\n\nFUEL: ' + Game.player.getFuel().toFixed(0) +
                '\n\nHSC: ' + Game.player.getHsc() +
                '\n\nRAW-MAT: ' + Game.player.getRawMat()
            );
        }

    }

}

export default UiScene;
