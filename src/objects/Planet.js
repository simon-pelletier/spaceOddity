/* ========================================================================== */
/*                                                                            */
/*                             PLANET - GAMEOBJECT                            */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

export default class Planet extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.x, config.y, config.key, config.seed, config.id);

        var self = this;

        this.seed = config.seed;

        //this.planetId = config.id;
        this.name = this.seed.name;
        this.size = this.seed.size / 20;
        this.distance = this.seed.distance;
        this.mass = this.seed.mass;
        this.speed = this.seed.speed;
        this.offset = this.seed.offset;
        this.color = this.seed.color;
        this.satellites = this.seed.satellites;
        this.materials = this.seed.materials;
        this.visited = this.seed.visited;

        // Construit le body de Planet
        this.bodyPlanet = config.scene.matter.add.image(config.x, config.y, config.key)
        this.bodyPlanet.setBody({
            type: 'polygon',
            radius: 375,
            sides: 64
        }, {
            label: 'planetBody'
        });

        // Configure le body de planet
        this.bodyPlanet.setTint(this.color);
        this.bodyPlanet.setScale(this.size);
        this.bodyPlanet.setStatic(true);

        this.bodyPlanet.setTintFill(this.color);
        this.bodyPlanet.setScale(this.size / 20);
        this.bodyPlanet.setMass(this.mass * 1);
        this.bodyPlanet.setStatic(true);
        this.bodyPlanet.setIgnoreGravity(true);
        this.bodyPlanet.setPosition(Setup.ORIGIN_X + this.distance, Setup.ORIGIN_Y);
        this.bodyPlanet.setData({
            id: config.id,
            name: this.name,
            color: this.color,
            vector: new Phaser.Math.Vector2()
        });

        // Ajoute le body au gameObject Planet
        this.body = this.bodyPlanet.body;

        return this;
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

    }

    /* ========================================================================== */
    /*                                   SETTERS                                  */
    /* ========================================================================== */

    setVisited() {
        this.visited = true;
        Game.univers[Game.currentSystem].system[Game.currentPlanet].visited = true;
    }


}
