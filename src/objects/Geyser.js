/* ========================================================================== */
/*                                                                            */
/*                              GEYSER GAMEOBJECT                             */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';
import {
    getRandomColor
} from '../helpers/helpers';
import * as Helpers from '../helpers/helpers';

export default class Geyser extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.id, config.sort, config.points, config.pointsInfo, config.margin, config.quantity);

        // Variables globales
        var scene = config.scene;
        var self = this;
        var seedPlanet = Game.univers[Game.currentSystem].system[Game.currentPlanet];

        // Attributs
        this.id = config.id;
        this.sort = config.sort;
        this.points = config.points;
        this.pointsInfo = config.pointsInfo;
        this.margin = config.margin
        this.quantity = config.quantity;

        this.indice = Number(this.id);

        /* -------------------------------- Controls -------------------------------- */
        this.keyPumpFuel = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Bodies Matter Déclaration
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        var geyserBodyPartA = Bodies.circle(0, -200, 160, {
            label: "geyserBodyPartA",
            isSensor: true
        });
        var geyserBodyPartB = Bodies.circle(0, 350, 160, {
            label: "geyserBody",
            isSensor: true,
            data: {
                id: this.id
            }
        });
        var geyserBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [geyserBodyPartA, geyserBodyPartB],
            label: 'geyserBodyBlock',
            isSensor: true,
            ignoreGravity: true,
            isStatic: true
        });

        // Ajoute et configure un nouvel élément Geyser
        this.geyser = scene.matter.add.sprite(this.points[this.indice].x, this.points[this.indice].y, 'geyser', null, {
            ignoreGravity: true
        });
        this.geyser.setExistingBody(geyserBody);
        this.geyser.setScale(0.2);
        this.geyser.setDepth(50);
        this.geyser.isSensor(true);
        this.geyser.setData({
            id: this.id
        });
        this.geyser.setPosition(this.points[this.indice].x, this.points[this.indice].y);
        this.geyser.rotation = 1.56 + ((this.indice + this.margin) / this.points.length);
        this.geyser.setIgnoreGravity(true);
        this.body = geyserBody.body;

        /* ------------------------------- ANIMATIONS ------------------------------- */
        this.geyser.anims.play('flow');

        /* ---------------------------------- TEXTS --------------------------------- */
        // Définit le Style du text infoPlanetTxt
        var styleText = {
            fontSize: '15px',
            fontFamily: Setup.TYPO,
            color: '#141414',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        };

        // Ajoute le texte uiText
        this.geyserText = config.scene.add.text(0, 0, '', styleText).setPadding(10, 10);
        this.geyserText.setDepth(0);
        this.geyserText.setPosition(this.pointsInfo[this.indice].x, this.pointsInfo[this.indice].y);
        this.geyserText.rotation = 1.56 + ((this.indice + this.margin) / this.points.length);
        this.geyserText.setText(
            this.quantity
        );
        

        return this;
    }

    update(i) {
        if (this.keyPumpFuel.isDown) {
            Game.player.pumpFuel(5);
            //this.quantity -= 5;
            Game.univers[Game.currentSystem].system[Game.currentPlanet].materials[i].quantity -= 5;
            this.quantity = Game.univers[Game.currentSystem].system[Game.currentPlanet].materials[i].quantity

            if (this.quantity > 0){
                this.geyserText.setText(
                    this.quantity
                );
            }else {
                this.geyserText.setText(

                );
            }
            
        }
    }

}
