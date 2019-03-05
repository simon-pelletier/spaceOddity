/* ========================================================================== */
/*                                                                            */
/*                                GAME - PHASER                               */
/*                                                                            */
/* ========================================================================== */

import 'phaser';
import * as Setup from './setup';

/* --------------------------------- Scenes --------------------------------- */

import PreloaderScene from './scenes/PreloaderScene';
import MenuScene from './scenes/MenuScene';
import PlanetScene from './scenes/PlanetScene';
import SystemScene from './scenes/SystemScene';
import MapScene from './scenes/MapScene';
import UiScene from './scenes/UiScene';
import HighSpeedScene from './scenes/HighSpeedScene';
import EndGameScene from './scenes/EndGameScene';

/* ------------------------------ Configuration ----------------------------- */

const config = {
    type: Phaser.AUTO,
    scale: {
        width: Setup.WIDTH,
        height: Setup.HEIGHT,
        scale: 'SHOW_ALL',
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
        HighSpeedScene
    ],
    title: 'Space Oddity',
    version: '0.1.0'
};

const game = new Phaser.Game(config);
export default game;