/* ========================================================================== */
/*                                                                            */
/*                               STAR GAMEOBJECT                              */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

export default class Star extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.x, config.y, config.key, config.seed);

        this.seed = config.seed;

        this.name = this.seed.name;
        this.size = this.seed.size / 20;
        this.mass = this.seed.mass;
        this.offset = this.seed.offset;
        this.color = this.seed.color;

        // Construit le body de Star
        var bodyStar = config.scene.matter.add.image(config.x, config.y, config.key)
        bodyStar.setBody({
            type: 'polygon',
            radius: 100,
            sides: 64
        }, {
            label: 'starBody',
            plugin: {
                // Ajout des paramètres Attractor à l'étoile
                attractors: [
                    function (bodyA, bodyB) {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 0.00000002,
                            y: (bodyA.position.y - bodyB.position.y) * 0.00000002
                            //x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            //y: (bodyA.position.y - bodyB.position.y) * 1e-6
                        };
                    }
                ]
            }
        });

        // Configure le body de star
        bodyStar.setTint(this.color);
        bodyStar.setScale(this.size / 3);
        bodyStar.setStatic(true);

        // Ajoute le body au gameObject Star
        this.body = bodyStar.body;

        return this;
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {

    }

}
