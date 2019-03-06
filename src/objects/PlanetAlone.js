/* ========================================================================== */
/*                                                                            */
/*                             PLANET - GAMEOBJECT                            */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';

export default class PlanetAlone extends Phaser.GameObjects.GameObject {

    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {

        super(config.scene, config.x, config.y, config.key, config.seed);

        this.seed = config.seed;

        this.name = this.seed.name;
        this.size = this.seed.size / Setup.PLANET_SIZE_FACTOR;
        this.distance = this.seed.distanceToStar;
        this.mass = this.seed.mass;
        this.speed = this.seed.speed;
        this.offset = this.seed.offset;
        this.color = this.seed.color;
        this.satellites = this.seed.satellites;
        this.materials = this.seed.materials;
        this.visited = this.seed.visited;
        this.gravity = this.seed.gravity;

        var self = this;

        // Construit le body de Planet
        var bodyPlanet = config.scene.matter.add.image(config.x, config.y, config.key)
        bodyPlanet.setBody({
            type: 'polygon',
            radius: 375,
            sides: 64
        }, {
            label: 'planetBody',
            plugin: {
                // Ajout des paramètres Attractor à la Planet
                attractors: [
                    function (bodyA, bodyB) {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * (0.000001 * self.gravity),
                            y: (bodyA.position.y - bodyB.position.y) * (0.000001 * self.gravity)
                            //x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            //y: (bodyA.position.y - bodyB.position.y) * 1e-6
                        };
                    }
                ]
            }
        });

        // Configure le body de planet
        bodyPlanet.setTint(this.color);
        bodyPlanet.setScale(this.size);
        bodyPlanet.setStatic(true);

        // Ajoute le body au gameObject Planet
        this.body = bodyPlanet.body;

        // Définit le Style du text infoPlanetTxt
        var styleText = {
            fontSize: '25px',
            fontFamily: Setup.TYPO,
            color: '#141414',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        };

        // Ajoute le texte uiText
        this.planetText = config.scene.add.text(0, 0, '', styleText).setPadding(10, 10);
        this.planetText.setDepth(0);
        this.planetText.setPosition(this.size * 340, -this.size * 340);
        this.planetText.rotation = -0.8;
        this.planetText.setText(
            this.name
        );

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
