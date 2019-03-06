/* ========================================================================== */
/*                                                                            */
/*                              RAWMAT GAMEOBJECT                             */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';
import {
    getRandomColor
} from '../helpers/helpers';
import * as Helpers from '../helpers/helpers';

export default class RawMat extends Phaser.GameObjects.GameObject {

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
        this.keyDigRawMat = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Bodies Matter Déclaration
        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        var rawMatBodyPartA = Bodies.circle(0, -60, 60, {
            label: "rawMatBodyPartA",
            isSensor: true
        });
        var rawMatBodyPartB = Bodies.circle(0, 140, 60, {
            label: "rawMatBody",
            isSensor: true,
            data: {
                id: this.id
            }
        });
        var rawMatBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [rawMatBodyPartA, rawMatBodyPartB],
            label: 'rawMatBodyBlock',
            isSensor: true,
            ignoreGravity: true,
            isStatic: true
        });

        // Ajoute et configure un nouvel élément rawMat
        this.rawMat = scene.matter.add.sprite(this.points[this.indice].x, this.points[this.indice].y, 'rawMat', null, {
            ignoreGravity: true
        });
        this.rawMat.setExistingBody(rawMatBody);
        this.rawMat.setScale(0.5);
        this.rawMat.setDepth(50);
        this.rawMat.isSensor(true);
        this.rawMat.setData({
            id: this.id
        });
        this.rawMat.setPosition(this.points[this.indice].x, this.points[this.indice].y);
        this.rawMat.rotation = 1.56 + ((this.indice + this.margin) / this.points.length);
        this.rawMat.setIgnoreGravity(true);
        this.body = rawMatBody.body;

        /* ------------------------------- ANIMATIONS ------------------------------- */
        this.rawMat.anims.play('idle');

        /* ---------------------------------- TEXTS --------------------------------- */
        // Définit le Style du text infoPlanetTxt
        var styleText = {
            fontSize: '15px',
            fontFamily: Setup.TYPO,
            color: '#141414',
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        };

        // Ajoute le texte uiText
        this.rawMatText = config.scene.add.text(0, 0, '', styleText).setPadding(10, 10);
        this.rawMatText.setDepth(0);
        this.rawMatText.setPosition(this.pointsInfo[this.indice].x, this.pointsInfo[this.indice].y);
        this.rawMatText.rotation = 1.56 + ((this.indice + this.margin) / this.points.length);
        this.rawMatText.setText(
            this.quantity
        );
        
        return this;
    }

    update(i) {
        if (this.keyDigRawMat.isDown) {
            Game.player.digRawMat(5);
            //this.quantity -= 5;
            Game.univers[Game.currentSystem].system[Game.currentPlanet].materials[i].quantity -= 5;
            this.quantity = Game.univers[Game.currentSystem].system[Game.currentPlanet].materials[i].quantity

            if (this.quantity > 0){
                this.rawMatText.setText(
                    this.quantity
                );
            }else {
                this.rawMatText.setText(

                );
            }
            
        }
    }

}
