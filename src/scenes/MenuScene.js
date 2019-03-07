/* ========================================================================== */
/*                                                                            */
/*                                MENU - SCENE                                */
/*                                                                            */
/* ========================================================================== */

import * as Helpers from '../helpers/helpers';
import * as Setup from '../setup';

import defaultSceneConfig from '../helpers/sceneConfig';

import generateUnivers from '../helpers/univerSizer';

import Player from '../objects/Player';

import Game from '../game';

class MenuScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'MenuScene'
        });
    }

    /* ========================================================================== */
    /*                                   CREATE                                   */
    /* ========================================================================== */

    create() {

        /* ------------------------------ Scene config ------------------------------ */

        // Variables Globales
        var self = this;

        // Configure la scene par défaut
        defaultSceneConfig(this);

        // Ajoute au curseur la fonction Drag&Drop
        this.matter.add.mouseSpring({
            length: 1,
            stiffness: 0.6
        });

        // Définit les bords de la scene en colliders
        this.matter.world.setBounds();

        /* ----------------------------- MATTER OBJECTS ----------------------------- */

        // Ajoute le logo du jeu
        this.logo = this.matter.add.image(Setup.ORIGIN_X, Setup.ORIGIN_Y - 60, 'logo', null, {
            chamfer: 16,
            ignoreGravity: true
        })

        // Ajoute le bouton 'Play'
        this.playBtn = this.matter.add.sprite(Setup.ORIGIN_X, Setup.ORIGIN_Y + 130, 'play', null, {


            ignoreGravity: true
        }).setInteractive({
            cursor: 'url(./assets/cursor/select.cur), pointer'
        });

        // Ajoute le this.shipMenu
        this.shipMenu = this.matter.add.sprite(Setup.WIDTH - 100, Setup.ORIGIN_Y + 150, 'ship', null, {
            isStatic: false,
            shape: {
                type: 'circle',
                radius: 120
            }
        });
        this.shipMenu.setScale(0.2);
        this.shipMenu.setFrictionAir(0.01);
        this.shipMenu.setMass(3);
        this.shipMenu.setIgnoreGravity(true);
        this.shipMenu.setDepth(10);
        this.shipMenu.setAngle(-90);

        /* ------------------------------- ANIMATIONS ------------------------------- */
        this.shipMenu.anims.play('idleShip');

        /* --------------------------------- GROUPS --------------------------------- */

        // Ajoute le groupe Background
        this.backGround = this.add.group({
            key: 'starOnePx',
            frameQuantity: 150
        });

        // Créé les étoiles du background
        this.starBackground = new Phaser.Geom.Rectangle(0, 0, Setup.WIDTH, Setup.HEIGHT);
        Phaser.Actions.RandomRectangle(this.backGround.getChildren(), this.starBackground);

        /* --------------------------------- SOUNDS --------------------------------- */

        // Ajoute le son de musique d'intro et le joue en boucle
        this.musicIntro = this.sound.add('intro');
        this.musicIntro.volume = 0.5;
        this.musicIntro.loop = true;
        this.musicIntro.play();
        // Ajout du son de Thrusters
        this.soundThrusterTop = this.sound.add('soundThruster');
        this.soundThrusterTop.volume = 0.2;
        this.soundThrusterTop.loop = true;

        /* -------------------------------- LISTENERS ------------------------------- */

        // Anime les états du bouton 'PLAY'
        this.playBtn.on('pointerover', function () {
            this.setScale(1.1, 1.1);
            this.setTint(0xdc324a);

            self.shipMenu.anims.play('upAnimShip');
            self.soundThrusterTop.play();
            self.shipMenu.thrustLeft(0.1);
            //self.shipMenu.setVelocityX(Helpers.getRandomNumber(-5, -10));
            //self.shipMenu.setAngularVelocity(Helpers.getRandomNumberFloat(0.03, 0.1));
        });
        this.playBtn.on('pointerout', function () {
            this.setScale(1, 1);
            this.setTint(0xcccccc);

            self.shipMenu.anims.play('idleShip');
            self.soundThrusterTop.stop();
        });
        this.playBtn.on('pointerdown', function () {
            this.setTint(0xcccccc);
        });
        this.playBtn.on('pointerup', this.doStart.bind(this));

    }

    /* ========================================================================== */
    /*                                 MENU START                                 */
    /* ========================================================================== */

    doStart() {

        // Arrete le son de thruster
        this.soundThrusterTop.stop();

        // Génère un nouvel Univers
        this.game.univers = generateUnivers();
        this.game.currentSystem = 0;
        this.game.currentPlanet = 1;

        /* ------------------------------ GAME OBJECTS ------------------------------ */

        // Object Planet
        this.player = new Player({
            scene: this,
            name: 'playerNameTemp',
            key: 'player'
        });

        Game.player = this.player;
        Game.firstPlanet = true;

        // Stoppe la musique d'intro
        this.musicIntro.stop();

        // Démarre la scene Planet (début de partie)
        this.scene.start(Setup.STARTSCENE + 'Scene');

        this.scene.launch('UiScene');

    }
}

export default MenuScene;
