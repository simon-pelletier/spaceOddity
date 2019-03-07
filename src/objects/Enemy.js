/* ========================================================================== */
/*                                                                            */
/*                             ENEMY - GAMEOBJECT                             */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

export default class Enemy extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.x, config.y, config.key, config.seed, config.id);
        var self = this;

        //this.planetId = config.id;
        //this.name = this.seed.name;
        //this.size = this.seed.size / 20;

        // Ajoute le body au gameObject Planet
        //this.body = this.bodyPlanet.body;

        return this;
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

    }


}
