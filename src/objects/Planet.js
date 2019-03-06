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
        this.bodyPlanet = config.scene.matter.add.image(config.x, config.y, config.key);
        this.bodyPlanet.setData({
            id: config.id,
            name: this.name,
            color: this.color,
            vector: new Phaser.Math.Vector2(),
            mass: this.mass,
            visited: this.visited,
            speed: this.speed
        });
        this.bodyPlanet.setInteractive({
            cursor: 'url(./assets/cursor/select.cur), pointer'
        });
        
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
        this.bodyPlanet.setPosition(Setup.ORIGIN_X + this.distance, Setup.ORIGIN_Y);
        
        /* --------------------------------- TEXTES --------------------------------- */

        // Définit le Style du text infoPlanetTxt
        /*var styleText = {
            fontSize: '16px',
            fontFamily: Setup.TYPO,
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        };

        // Ajoute le texte infoPlanetTxt
        this.infoPlanetTxt = config.scene.add.text(100, 50, '', styleText).setPadding(10, 10);
        this.infoPlanetTxt.setDepth(30);*/

        /* -------------------------------- LISTENERS ------------------------------- */

        // On Over Game Objects (Planet)
        /*config.scene.input.on('gameobjectover', function (pointer, gameObject, event) {
            console.log('HAHA');
            // Calcul de la distance Ship - Planet
            //var distanceX = Math.abs(currentShip.x - gameObject.x);
            //var distanceY = Math.abs(currentShip.y - gameObject.y);
            //var distance = distanceX + distanceY;
            // GameObject Planet sélectionné
            //selectedPlanetOnOver = gameObject;
            // Définit le contenu de la zone de texte
            //self.infoPlanetTxt.setText('jjjjjj');
            // Positionne la zone de texte sur la Planet
            //self.infoPlanetTxt.setPosition(gameObject.x + 20, gameObject.y - 20);
        });*/

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
