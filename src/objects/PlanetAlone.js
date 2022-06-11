/* ========================================================================== */
/*                                                                            */
/*                             PLANET - GAMEOBJECT                            */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';
import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

export default class PlanetAlone extends Phaser.GameObjects.GameObject {
    /* ========================================================================== */
    /*                                 CONSTRUCTOR                                */
    /* ========================================================================== */

    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.seed);

        this.seed = config.seed;
        this.scene = config.scene;
        this.name = this.seed.name;
        this.size = this.seed.size;
        this.distance = this.seed.distanceToStar;
        this.mass = this.seed.mass;
        this.speed = this.seed.speed;
        this.offset = this.seed.offset;
        this.color = this.seed.color;
        this.satellites = this.seed.satellites;
        this.materials = this.seed.materials;
        this.visited = this.seed.visited;
        // this.gravity = this.seed.gravity;
        this.bgColor = this.seed.bgColor;

        var self = this;

        // var point = circle.getPoint(0);
        // console.log('point', circle)

        //* WIP custom planet
        // polygon: ƒ (x, y, sides, radius, options)
        //! SHAPE
        // var planetShape = Helpers.planetShapeGenerator(this.size, 64);
        // var planetShape = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';
        // var poly = this.add.polygon(config.x, config.y, star, 0x0000ff, 0.2);
        // config.scene.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: arrow, flagInternal: true } })

        //! SHAPE
        // let circle = config.scene.add.polygon(
        //     config.x,
        //     config.y,
        //     planetShape,
        //     this.color
        // );

        //! SHAPE
        // var bodyPlanet = config.scene.matter.add.gameObject(circle, {
        //     shape: { type: 'fromVerts', verts: planetShape },
        //     label: 'planetBody',
        //     isStatic: true,
        //     // friction: 0.5, // 0-1
        //     // mass: self.mass,
        //     mass: 500,
        //     // render: https://newdocs.phaser.io/docs/3.55.2/Phaser.Types.Physics.Matter.MatterBodyRenderConfig ,
        //     plugin: {
        //         // Ajout des paramètres Attractor à la Planet
        //         attractors: [
        //             function (bodyA, bodyB) {
        //                 if (
        //                     bodyA.label === 'planetBody' &&
        //                     bodyB.label === 'shipBodyCompound'
        //                 ) {
        //                     // console.log(5.972 * Math.pow(10, 24))
        //                     // console.log('bodyA', bodyA);
        //                     // console.log('bodyB', bodyB);
        //                     let G = 0.0000000667;
        //                     let m1 = self.mass;
        //                     // let m1 = 5.972 * Math.pow(10, 24);
        //                     // let m1 = 5000000;
        //                     // let m1 = 17000000;
        //                     let m2 = bodyB.mass;
        //                     // console.log(
        //                     //     'bodyA.position.x',
        //                     //     bodyA.position.x
        //                     // );
        //                     // console.log(
        //                     //     'bodyA.position.y',
        //                     //     bodyA.position.y
        //                     // );

        //                     let distance = Helpers.getDistanceBetween(
        //                         {
        //                             x: 0,
        //                             y: 0
        //                         },
        //                         {
        //                             x: bodyB.position.x,
        //                             y: bodyB.position.y
        //                         }
        //                     );
        //                     // console.log('distance', distance)
        //                     //! thrust en fonction de la size ?
        //                     distance = distance - self.size + 500;
        //                     // console.log('self.size', self.size)
        //                     // console.log('distance2', distance);
        //                     let FG = (G * m1 * m2) / Math.pow(distance, 2);
        //                     // console.log('FG', FG * 0.1);
        //                     return {
        //                         x: (0 - bodyB.position.x) * FG,
        //                         y: (0 - bodyB.position.y) * FG
        //                         // x:
        //                         //     (0 - bodyB.position.x) *
        //                         //     (FG * 0.1),
        //                         // y:
        //                         //     (0 - bodyB.position.y) *
        //                         //     (FG * 0.1)
        //                         // x: (bodyA.position.x - bodyB.position.x) * (0.000001 * self.gravity),
        //                         // y: (bodyA.position.y - bodyB.position.y) * (0.000001 * self.gravity)
        //                         //x: (bodyA.position.x - bodyB.position.x) * 1e-6,
        //                         //y: (bodyA.position.y - bodyB.position.y) * 1e-6
        //                     };
        //                 }
        //             }
        //         ]
        //     }
        // });

        var bodyPlanet = config.scene.matter.add.polygon(
            config.x,
            config.y,
            64,
            this.size,
            {
                label: 'planetBody',
                isStatic: true,
                // friction: 0.5, // 0-1
                // mass: self.mass,
                mass: 500,
                //* For debug only
                // render: {
                //     fillColor: 0x00ff00,
                //     // lineThickness: 50,
                //     lineColor: 0x00ff00,
                //     // fillStyle: 0x00ff00
                // },
                // render: https://newdocs.phaser.io/docs/3.55.2/Phaser.Types.Physics.Matter.MatterBodyRenderConfig ,
                plugin: {
                    // Ajout des paramètres Attractor à la Planet
                    attractors: [
                        function (bodyA, bodyB) {
                            if (
                                bodyA.label === 'planetBody' &&
                                bodyB.label === 'shipBodyCompound'
                            ) {
                                // console.log(5.972 * Math.pow(10, 24))
                                // console.log('bodyA', bodyA);
                                // console.log('bodyB', bodyB);
                                let G = 0.0000000667;
                                let m1 = self.mass;
                                // let m1 = 5.972 * Math.pow(10, 24);
                                // let m1 = 5000000;
                                // let m1 = 17000000;
                                let m2 = bodyB.mass;
                                // console.log(
                                //     'bodyA.position.x',
                                //     bodyA.position.x
                                // );
                                // console.log(
                                //     'bodyA.position.y',
                                //     bodyA.position.y
                                // );

                                let distance = Helpers.getDistanceBetween(
                                    {
                                        x: 0,
                                        y: 0
                                    },
                                    {
                                        x: bodyB.position.x,
                                        y: bodyB.position.y
                                    }
                                );
                                // console.log('distance', distance)
                                //! thrust en fonction de la size ?
                                distance = distance - self.size + 500;
                                // console.log('self.size', self.size)
                                // console.log('distance2', distance);
                                let FG = (G * m1 * m2) / Math.pow(distance, 2);
                                // console.log('FG', FG * 0.1);
                                return {
                                    x: (0 - bodyB.position.x) * FG,
                                    y: (0 - bodyB.position.y) * FG
                                    // x:
                                    //     (0 - bodyB.position.x) *
                                    //     (FG * 0.1),
                                    // y:
                                    //     (0 - bodyB.position.y) *
                                    //     (FG * 0.1)
                                    // x: (bodyA.position.x - bodyB.position.x) * (0.000001 * self.gravity),
                                    // y: (bodyA.position.y - bodyB.position.y) * (0.000001 * self.gravity)
                                    //x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                                    //y: (bodyA.position.y - bodyB.position.y) * 1e-6
                                };
                            }
                        }
                    ]
                }
            }
        );

        console.log('bodyPlanet', bodyPlanet);
        for (let p = 0; p < 64; p++) {
            bodyPlanet.vertices[p].x =
                bodyPlanet.vertices[p].x + Helpers.getRandomNumber(-10, 10);
            bodyPlanet.vertices[p].y =
                bodyPlanet.vertices[p].y + Helpers.getRandomNumber(-10, 10);
        }

        // let circle = config.scene.add.polygon(
        //     config.x,
        //     config.y,
        //     this.size,
        //     this.color
        // );
        let circle = config.scene.add.polygon(
            config.x + this.size + 5,
            config.y + this.size + 5,
            bodyPlanet.vertices,
            this.color
        );
        // circle.setOrigin(0.5, 0.5);
        // circle.setPosition(this.size * 2, this.size)
        // circle.originX = this.size;
        console.log('circle', circle);
        circle.smooth()

        // config.scene.matter.add.gameObject(circle, bodyPlanet);

        // Ajoute le body au gameObject Planet
        this.planet = bodyPlanet;

        // Définit le Style du text infoPlanetTxt
        var styleText = {
            fontSize: '25px',
            fontFamily: Setup.TYPO,
            color: '#141414',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        };

        // Ajoute le texte uiText
        this.planetText = config.scene.add
            .text(0, 0, '', styleText)
            .setPadding(10, 10);
        this.planetText.setDepth(0);
        this.planetText.setPosition(this.size, -this.size);
        this.planetText.rotation = -0.8;
        this.planetText.setText(this.name);

        return this;
    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {
        // this.graphics = this.scene.add.graphics();
        // this.graphics.lineStyle(10, 0x00ff00, 1);
        // this.graphics.lineBetween(
        //     this.planet.position.x,
        //     this.planet.position.y,
        //     this.scene.ship.body.body.position.x,
        //     this.scene.ship.body.body.position.y
        // );
    }

    /* ========================================================================== */
    /*                                   SETTERS                                  */
    /* ========================================================================== */

    setVisited() {
        this.visited = true;
        Game.univers[Game.currentSystem].system[
            Game.currentPlanet
        ].visited = true;
    }
}
