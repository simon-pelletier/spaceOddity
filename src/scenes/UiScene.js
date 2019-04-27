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
        /*this.uiText = this.add.text(0, 0, '', styleText).setPadding(20, 20);

        this.uiText.setDepth(30);
        this.uiText.setPosition(0, 0);*/

        // Définit le Style du text infoPlanetTxt
        var helpStyleText = {
            fontSize: '17px',
            fontFamily: Setup.TYPO,
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
        };

        // Ajoute le texte helpText
        this.helpText = this.add.text(40, 450, '', helpStyleText).setPadding(10, 10);
        this.helpText.setDepth(30);

        this.helpText.setText(
            '[M]ap' +
            '\n[E]xtract resources' +
            '\n[R]epair Ship' +
            '\nCraft 1 [H]SC for 1K Fuel' +
            '\nCraft 1K [F]uel for 1 HSC'
        );

        /* -------------------------------- GRAPHISME ------------------------------- */
        
        this.ui_base = this.add.image(Setup.ORIGIN_X + 5, 109, 'ui_base');

        this.gravity_needle = this.add.image(Setup.WIDTH - 125, 90, 'needle');
        this.speed_needle = this.add.image(Setup.WIDTH - 240, 60, 'needle');
        this.speed_needle.setScale(0.6);
        this.alt_needle = this.add.image(Setup.WIDTH - 61, 165, 'needle');
        this.alt_needle.setScale(0.6);
        this.alt_needle.rotation = 0.3;

        this.fuel_needle = this.add.image(160, 105, 'needleH');
        this.mats_needle = this.add.image(265, 105, 'needleH');
        this.health_needle = this.add.image(370, 105, 'needleH');

        this.hscBulbs = [];
        var marginHscBulb = 0;
        for (var i = 0; i < Game.player.maxHsc; i++){
            this.hscBulb = this.add.image(317 + marginHscBulb, 182, 'hscBulb');
            this.hscBulbs.push(this.hscBulb);
            marginHscBulb += 19.8;
        }

        /* ----------------------------- Ajoute un TImer ---------------------------- */

        /*this.globalTimer = this.time.addEvent({
            //delay: 500, // ms
            //callback: callback,
            //args: [],
            //callbackScope: thisArg,
            loop: true
        });*/

    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {
        //this.helpText.setPosition({x:400,y:200});

        for (var i = 0; i < this.hscBulbs.length; i++){
            if (i < Number(Game.player.hsc)){
                this.hscBulbs[i].y = 182;
            } else {
                this.hscBulbs[i].y = -100;
            }
        }
        
        this.speed_needle.angle = (Game.ship.body.body.speed * 10).toFixed(0);
        this.alt_needle.angle = Game.ship.getAltitude().toFixed(0);

        this.fuel_percentage = (Game.player.getFuel().toFixed(0) * 100) / Game.player.maxFuel;
        this.mats_percentage = (Game.player.getRawMat().toFixed(0) * 100) / Game.player.maxRawMat;
        this.health_percentage = (Game.player.getHealth().toFixed(0) * 100) / Game.player.maxHealth;

        this.fuel_needle.angle = ((this.fuel_percentage * 90) / 100).toFixed(0);
        this.mats_needle.angle = ((this.mats_percentage * 90) / 100).toFixed(0);
        this.health_needle.angle = ((this.health_percentage * 90) / 100).toFixed(0);

        if (Game.currentScene == 'Planet') {
            this.gravity_needle.angle = (Game.univers[Game.currentSystem].system[Game.currentPlanet].gravity * 100).toFixed(1);
        } else {
            this.gravity_needle.angle = 0;
        }

        /*if (Game.currentScene == 'Planet') {
            // Mise à jour du contenu du Text uiText
            this.uiText.setText(
                //'HEALTH: ' + Game.player.getHealth().toFixed(0) +
                //'\n\nSPEED: ' + Game.ship.body.body.speed.toFixed(0) +
                //'\n\nALT: ' + Game.ship.getAltitude().toFixed(0) +
                //'\n\nGRAVITY: ' + (Game.univers[Game.currentSystem].system[Game.currentPlanet].gravity * 10).toFixed(1) +
                //'\n\nFUEL: ' + Game.player.getFuel().toFixed(0) +
                //'\n\nHSC: ' + Game.player.getHsc() +
                //'\n\nRAW-MAT: ' + Game.player.getRawMat().toFixed(0)
            );
        } else {
            // Mise à jour du contenu du Text uiText
            this.uiText.setText(
                //'HEALTH: ' + Game.player.getHealth().toFixed(0) +
                //'\n\nSPEED: ' + Game.ship.body.body.speed.toFixed(0) +
                //'\n\nGRAVITY: 0' +
                //'\n\nFUEL: ' + Game.player.getFuel().toFixed(0) +
                //'\n\nHSC: ' + Game.player.getHsc() +
                //'\n\nRAW-MAT: ' + Game.player.getRawMat().toFixed(0)
            );
        }*/

    }

}

export default UiScene;
