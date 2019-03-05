/* ========================================================================== */
/*                                                                            */
/*                                  MAP SCENE                                 */
/*                                                                            */
/* ========================================================================== */

import Game from '../game';

import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

import defaultSceneConfig from '../helpers/sceneConfig';

class MapScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'MapScene'
        });
    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {

        // Variables globales
        var self = this;

        // Configure la scene par défaut
        defaultSceneConfig(this);

        // Définit le Style du text infoSystemTxt
        var styleText = {
            fontSize: '16px',
            fontFamily: Setup.TYPO,
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.6)'
        };

        // Ajoute le texte infoSystemTxt
        this.infoSystemTxt = this.add.text(100, 50, '', styleText).setPadding(10, 10);

        /* ------------------------------- ANIMATIONS ------------------------------- */

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 1);
        //this.blackBg = new Phaser.Geom.Rectangle(0,0,500,500);
        this.graphics.fillRect(0, 0, Setup.WIDTH, Setup.HEIGHT);
        this.graphics.fillStyle(0xffffff, 1);

        // Créé la ligne visuelle d'HS
        // Ajout des graphics à la scene
        this.currentMapGraphics = this.add.graphics();
        this.currentMapGraphics.lineStyle(1, 0xffffff, 0.5);

        this.lineHS = new Phaser.Geom.Line(Game.univers[Game.currentSystem].systemX, Game.univers[Game.currentSystem].systemY, Game.univers[Game.currentSystem].systemX, Game.univers[Game.currentSystem].systemY);

        // Ajoute et configure le point (Ship) qui parcours la lineHS
        this.pointHS = this.matter.add.sprite(Game.univers[Game.currentSystem].systemX, Game.univers[Game.currentSystem].systemY + 20, 'ship', null, {
            isStatic: false,
            ignorePointer: true,
            ignoreGravity: true
        });
        this.pointHS.setScale(0.15);
        this.pointHS.setDepth(10);
        this.pointHS.setFixedRotation();
        this.pointHS.anims.play('idleShip');

        // Background - Ajout de groupe d'étoiles_mini
        this.bg = this.add.group({
            key: 'starOnePx',
            frameQuantity: 500
        });

        // Création des étoiles_mini
        var rect = new Phaser.Geom.Rectangle(0, 0, Setup.WIDTH, Setup.HEIGHT);
        Phaser.Actions.RandomRectangle(this.bg.getChildren(), rect);

        /* -------------------------------- LISTENERS ------------------------------- */

        // On Over Game Objects (System)
        this.input.on('gameobjectover', function (pointer, gameObject, event) {
            // Calcul la distance System - System
            var distance = Helpers.getDistanceBetween({
                x: Game.univers[Game.currentSystem].systemX,
                y: Game.univers[Game.currentSystem].systemY
            }, gameObject);
            // Calcul le nombre de HSC pour voyager
            var chargesToGo = Math.round(distance / 100);
            // Définit la direction System - System
            var direction = Helpers.getAngle(Game.univers[Game.currentSystem].systemX, Game.univers[Game.currentSystem].systemY, gameObject.x, gameObject.y);
            // Configure le point (Ship) en fonction de la direction
            self.pointHS.setScale(0.1);
            self.pointHS.setFixedRotation();
            self.pointHS.setAngle(direction + 90);

            // Créé une nouvelle ligne
            self.line = new Phaser.Geom.Line(Game.univers[Game.currentSystem].systemX, Game.univers[Game.currentSystem].systemY, gameObject.x, gameObject.y);
            self.lineHS = self.line;
            // Définit le contenu de la zone de texte InfoSystem
            self.infoSystemTxt.setText(
                'System: ' + gameObject.data.list.name +
                '\nDistance: ' + distance + ' AL' +
                '\nHSC: ' + chargesToGo +
                '\nVisited: ' + gameObject.data.list.visited
            );
            // Positionne la zone de texte sur le System
            self.infoSystemTxt.setPosition(gameObject.x + 20, gameObject.y - 20);
            self.infoSystemTxt.setDepth(50);

        });

        // On Clic Game Objects (System)
        this.input.on('gameobjectdown', function (pointer, gameObject, event) {
            // Calcul la distance System - System
            var distance = Helpers.getDistanceBetween({
                x: Game.univers[Game.currentSystem].systemX,
                y: Game.univers[Game.currentSystem].systemY
            }, gameObject);
            // Calcul le nombre de HSC pour voyager
            var chargesToGo = Math.round(distance / 100);

            // Si HS Charges suffisantes
            if (Game.player.getHsc() >= chargesToGo) {
                // Charge la scene System correspondant à l'id
                Game.currentSystem = gameObject.data.list.id;
                // Décrémente le nombre de HS Charges correspondantes au voyage
                Game.player.useHsc(chargesToGo);
                // Lance la scene System
                self.scene.start('HighSpeedScene');
            } else {
                // Pas assez de HS Charges
                console.log('Il te faut plus de charges pour partir si loin !');
            }
        });

        /* ---------------------------- CREATION SYSTEMS ---------------------------- */

        // Pour chaque System
        for (var i = 0; i < Game.univers.length; i++) {
            // Ajoute et configure l'étoile
            this.star = this.matter.add.image(Game.univers[i].systemX, Game.univers[i].systemY, 'star', null, {
                isStatic: true
            }).setInteractive({
                cursor: 'url(./assets/cursor/select.cur), pointer'
            });
            this.star.setTintFill(Game.univers[i].color);
            this.star.setScale(Game.univers[i].system.length / 100);
            this.star.setData({
                id: i,
                name: Game.univers[i].name,
                visited: Game.univers[i].visited
            });
        }

        /* -------------------------------- CONTROLS -------------------------------- */

        // On KeyDown Global
        this.input.keyboard.on('keydown', function (event) {

            // "M" a été pressé
            if (event.key == 'm') {
                // Stoppe la scene Map
                self.scene.stop();
                // Lance la scene System
                self.scene.resume('SystemScene');
                
            }

        });
        this.progressPointHS = 0;

    }

    /* ========================================================================== */
    /*                                   UPDATE                                   */
    /* ========================================================================== */

    update() {
        // Efface les graphics de la scene
        this.currentMapGraphics.clear();

        /* ----------------------- Animation HS Point and Line ---------------------- */

        this.progressPointHS += 0.005;
        if (this.progressPointHS > 1) {
            this.progressPointHS = 0;
        }
        this.lineHS.getPoint(this.progressPointHS, this.pointHS);
        this.currentMapGraphics.lineStyle(1, 0xffffff, 0.3);
        this.currentMapGraphics.fillStyle(0xffffff);
        this.currentMapGraphics.strokeLineShape(this.lineHS);

    }

}

export default MapScene;
