import 'phaser';
import * as Setup from './setup';

//* ALL SCENES

import PreloaderScene from './scenes/PreloaderScene';
import MenuScene from './scenes/MenuScene';
import PlanetScene from './scenes/PlanetScene';
import SystemScene from './scenes/SystemScene';
import MapScene from './scenes/MapScene';
import UiScene from './scenes/UiScene';
import HighSpeedScene from './scenes/HighSpeedScene';
import EndGameScene from './scenes/EndGameScene';
import FightScene from './scenes/FightScene';

//* GLOBAL GAME CONFIGURATION

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: 'LANDSCAPE'
    },
    physics: {
        default: 'matter',
        matter: {
            debug: Setup.DEVMOD,
            gravity: {
                y: Setup.GRAVITY
            }
        },
        arcade: {
            gravity: {
                y: Setup.GRAVITY
            },
            debug: Setup.DEVMOD
        }
    },
    scene: [
        PreloaderScene,
        MenuScene,
        PlanetScene,
        SystemScene,
        MapScene,
        UiScene,
        EndGameScene,
        HighSpeedScene,
        FightScene
    ],
    title: 'Space Oddity',
    version: '0.1.1'
};

const game = new Phaser.Game(config);
export default game;
