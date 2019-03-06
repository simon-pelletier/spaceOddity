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

        super(config.scene, config.key, config.e, config.g, config.point, config.margin);

        // Variables globales
        var scene = config.scene;
        var self = this;
        var seedPlanet = Game.univers[Game.currentSystem].system[Game.currentPlanet];

        // Variables de position et d'angle
        var g = config.g;
        var e = config.e;
        var pointsGeyser = config.point;
        var marginGeyser = config.margin;

        // Attributs
        this.id = Helpers.getRandomNumberFloat(0.005, 0.02);
        this.point = Helpers.getRandomNumberFloat(0.5, 3);
        this.quantity = Helpers.getRandomNumber(1, 6);

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
                id: seedPlanet.materials[e].id
            }
        });
        var geyserBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [geyserBodyPartA, geyserBodyPartB],
            label: 'geyserBodyBlock',
            isSensor: true,
            ignoreGravity: true,
            isStatic: true
        });

        // Ajoute et configure un nouvel élément de bors de scene
        this.geyser = scene.matter.add.sprite(pointsGeyser[g].x, pointsGeyser[g].y, 'geyser', null, {
            data: {
                id: seedPlanet.materials[e].id
            },
            ignoreGravity: true
        });
        this.geyser.setExistingBody(geyserBody);
        this.geyser.setScale(0.2);
        this.geyser.setDepth(50);
        this.geyser.isSensor(true);
        this.geyser.setData({
            id: seedPlanet.materials[e].id
        });
        this.geyser.setPosition(pointsGeyser[g].x, pointsGeyser[g].y);
        this.geyser.rotation = 1.56 + ((g + marginGeyser) / pointsGeyser.length);
        this.geyser.setIgnoreGravity(true);
        this.body = geyserBody.body;

        /* ------------------------------- ANIMATIONS ------------------------------- */
        this.geyser.anims.play('flow');

        /* --------------------------------- SOUNDS --------------------------------- */
        // Ajout du son de Pompe
        this.soundPump = scene.sound.add('pump');
        this.soundPump.volume = 0.5;
        this.soundPump.loop = true;

        return this;
    }

    update(){
        
    }

}
