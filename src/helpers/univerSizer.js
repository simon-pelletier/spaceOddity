import * as Setup from '../setup';
import Game from '../game';
import * as Helpers from '../helpers/helpers';

//* UNIVERS GENERATOR

export default function generateUnivers(scene) {
    var univers = [];

    var marginWorld = 50; // Position Margin of Systems on the Map

    for (var i = 0; i < Setup.NUMBER_MAX_OF_SYSTEMS; i++) {
        var systemColor = '0x' + Helpers.getRandomColor();
        var systemName = nameGenerator(1) + nameNumberGenerator();
        var system = {};
        if (i === 0) {
            system = {
                name: systemName,
                systemX: Game.canvas.clientWidth / 2,
                systemY: Game.canvas.clientHeight / 2,
                system: systemGenerator(systemName, '0xffffff'),
                color: '0xffffff',
                asteroidsFactor: Helpers.getRandomNumber(
                    0,
                    Setup.NUMBER_MAX_OF_ASTEROIDS
                ),
                visited: true
            };
        } else {
            system = {
                name: systemName,
                systemX: Helpers.getRandomNumber(
                    marginWorld,
                    Game.canvas.clientWidth - marginWorld
                ),
                systemY: Helpers.getRandomNumber(
                    marginWorld,
                    Game.canvas.clientHeight - marginWorld
                ),
                system: systemGenerator(systemName, systemColor),
                color: systemColor,
                asteroidsFactor: Helpers.getRandomNumber(
                    0,
                    Setup.NUMBER_MAX_OF_ASTEROIDS
                ),
                visited: false
            };
        }

        univers.push(system);
    }

    return univers;
}

//* SYSTEM GENERATOR

function systemGenerator(systemName, systemColor) {
    var systemGenerated = [];

    // Defines the number of planets in the system
    var planetNumber = Helpers.getRandomNumber(3, Setup.NUMBER_MAX_OF_PLANETS);

    var satellites = [];
    satellites.push('none');
    // Star creation
    var star = {
        name: systemName,
        size: Helpers.getRandomNumber(20, 30),
        distance: null,
        mass: Helpers.getRandomNumber(200, 2000),
        speed: null,
        offset: null,
        color: systemColor,
        satellites: satellites
    };

    // Add the sun to the system array
    systemGenerated.push(star);

    // Addition of planets in the system table
    for (var i = 0; i < planetNumber; i++) {
        systemGenerated.push(planetGenerator(i));
    }

    return systemGenerated;
}

//* System Name Generator

function nameNumberGenerator() {
    var number = Helpers.getRandomNumber(0, 3);
    var nameNumber = '';
    if (number !== 0) {
        nameNumber += '-';
    }
    for (var i = 0; i < number; i++) {
        nameNumber += Helpers.getRandomNumber(1, 9);
    }
    return nameNumber;
}

//* PLANET GENERATOR

function planetGenerator(i) {
    // Chance of having a satellite
    var satelliteChances = Helpers.getRandomNumber(
        1,
        Setup.ONE_PER_THIS_CHANCE_TO_HAVE_A_SAT
    );

    // Temporary array of satellites to be sent to the planet
    var satellites = [];
    if (satelliteChances === 1) {
        satellites.push(satelliteGenerator());
    } else {
        satellites.push('none');
    }

    // Planet creation
    var planet = {
        name: nameGenerator(1),
        size: Helpers.getRandomNumber(150, 500),
        distance: Helpers.getRandomNumber(50, Game.canvas.clientHeight / 2),
        mass: Helpers.getRandomNumber(Setup.MASS_MIN_OF_PLANET, Setup.MASS_MAX_OF_PLANET),
        speed: Helpers.getRandomNumber(10000, 30000),
        offset: Helpers.getRandomNumberFloat(0, 360),
        color: '0x' + Helpers.getRandomColor(),
        bgColor: '0x' + Helpers.getRandomColor(),
        satellites: satellites,
        materials: materialsGenerator(),
        visited: false,
        hostility: Helpers.getRandomNumber(0, 100)
    };

    return planet;
}

//* Materials Generator

function materialsGenerator() {
    var materials = [];
    // var chanceToHaveMaterials = Helpers.getRandomNumber(12, Setup.NUMBER_MAX_OF_MATERIALS); // DEBUG ?? r??gler sur (0,3) - MAX 12

    for (var i = 0; i < 12; i++) {
        var sortOfMaterial = Helpers.getRandomNumber(0, 10);
        var material = {};

        if (sortOfMaterial === 0) {
            material = {
                id: i,
                sort: 'geyser',
                point: i,
                quantity: Helpers.getRandomNumber(500, 2000)
            };
        } else if (sortOfMaterial === 1) {
            material = {
                id: i,
                sort: 'rawMat',
                point: i,
                quantity: Helpers.getRandomNumber(500, 2000)
            };
        } else {
            material = {
                id: i,
                sort: 'empty',
                point: i,
                quantity: 0
            };
        }

        materials.push(material);
    }

    return materials;
}

//* SATELLITE GENERATOR

function satelliteGenerator() {
    // Satellite Creation
    var satellite = {
        name: nameGenerator(1),
        size: Helpers.getRandomNumber(5, 8),
        distance: Helpers.getRandomNumber(25, 30),
        mass: Helpers.getRandomNumber(200, 2000),
        speed: Helpers.getRandomNumber(1000, 10000),
        offset: Helpers.getRandomNumberFloat(0, 360),
        color: '0x' + Helpers.getRandomColor()
    };

    return satellite;
}

//* ASTEROIDS SPAWN GENERATOR

function randomAsteroidSpawn() {
    // Asteroid Position
    var asteroidX = '';
    var asteroidY = '';

    // Asteroid high and low margin for Spawn
    var lowZone = 200;
    var highZone = 20;

    // Side on which the asteroid is positioned
    var side = Helpers.getRandomNumber(0, 3);

    if (side === 0) {
        asteroidX = Helpers.getRandomNumber(-lowZone, -highZone);
        asteroidY = Helpers.getRandomNumber(
            -lowZone,
            Game.canvas.clientHeight + lowZone
        );
    } else if (side === 1) {
        asteroidX = Helpers.getRandomNumber(
            -lowZone,
            Game.canvas.clientWidth + lowZone
        );
        asteroidY = Helpers.getRandomNumber(-lowZone, -highZone);
    } else if (side === 2) {
        asteroidX = Helpers.getRandomNumber(
            Game.canvas.clientWidth + highZone,
            Game.canvas.clientWidth + lowZone
        );
        asteroidY = Helpers.getRandomNumber(
            -lowZone,
            Game.canvas.clientHeight + lowZone
        );
    } else if (side === 3) {
        asteroidX = Helpers.getRandomNumber(
            -lowZone,
            Game.canvas.clientWidth + lowZone
        );
        asteroidY = Helpers.getRandomNumber(
            Game.canvas.clientHeight + highZone,
            Game.canvas.clientHeight + lowZone
        );
    }

    // Starting position of the asteroid
    var asteroidStartPoint = {
        x: asteroidX,
        y: asteroidY
    };

    return asteroidStartPoint;
}

//* REALISTIC NAME GENERATOR

function nameGenerator(count) {
    var vowels = {
        1: [
            'b',
            'c',
            'd',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'p',
            'q',
            'r',
            's',
            't',
            'v',
            'w',
            'x',
            'y',
            'z'
        ],
        2: ['a', 'e', 'o', 'u'],
        3: [
            'br',
            'cr',
            'dr',
            'fr',
            'gr',
            'pr',
            'str',
            'tr',
            'bl',
            'cl',
            'fl',
            'gl',
            'pl',
            'sl',
            'sc',
            'sk',
            'sm',
            'sn',
            'sp',
            'st',
            'sw',
            'ch',
            'sh',
            'th',
            'wh'
        ],
        4: [
            'ae',
            'ai',
            'ao',
            'au',
            'a',
            'ay',
            'ea',
            'ei',
            'eo',
            'eu',
            'e',
            'ey',
            'ua',
            'ue',
            'ui',
            'uo',
            'u',
            'uy',
            'ia',
            'ie',
            'iu',
            'io',
            'iy',
            'oa',
            'oe',
            'ou',
            'oi',
            'o',
            'oy'
        ],
        5: [
            'turn',
            'ter',
            'nus',
            'rus',
            'tania',
            'hiri',
            'hines',
            'gawa',
            'nides',
            'carro',
            'rilia',
            'stea',
            'lia',
            'lea',
            'ria',
            'nov',
            'phus',
            'mia',
            'nerth',
            'wei',
            'ruta',
            'tov',
            'zuno',
            'vis',
            'lara',
            'nia',
            'liv',
            'tera',
            'gantu',
            'yama',
            'tune',
            'ter',
            'nus',
            'cury',
            'bos',
            'pra',
            'thea',
            'nope',
            'tis',
            'clite'
        ],
        6: [
            'una',
            'ion',
            'iea',
            'iri',
            'illes',
            'ides',
            'agua',
            'olla',
            'inda',
            'eshan',
            'oria',
            'ilia',
            'erth',
            'arth',
            'orth',
            'oth',
            'illon',
            'ichi',
            'ov',
            'arvis',
            'ara',
            'ars',
            'yke',
            'yria',
            'onoe',
            'ippe',
            'osie',
            'one',
            'ore',
            'ade',
            'adus',
            'urn',
            'ypso',
            'ora',
            'iuq',
            'orix',
            'apus',
            'ion',
            'eon',
            'eron',
            'ao',
            'omia'
        ]
    };
    var mtx = [
        [1, 1, 2, 2, 5, 5],
        [2, 2, 3, 3, 6, 6],
        [3, 3, 4, 4, 5, 5],
        [4, 4, 3, 3, 6, 6],
        [3, 3, 4, 4, 2, 2, 5, 5],
        [2, 2, 1, 1, 3, 3, 6, 6],
        [3, 3, 4, 4, 2, 2, 5, 5],
        [4, 4, 3, 3, 1, 1, 6, 6],
        [3, 3, 4, 4, 1, 1, 4, 4, 5, 5],
        [4, 4, 1, 1, 4, 4, 3, 3, 6, 6]
    ];
    var fn = function (i) {
        return Math.floor(Math.random() * vowels[i].length);
    };
    var ret = [];
    var name;
    var comp;
    var i;
    var il;
    var c = 0;

    for (; c < count; c++) {
        name = '';
        comp = mtx[c % mtx.length];
        for (i = 0, il = comp.length / 2; i < il; i++) {
            name += vowels[comp[i * 2]][fn(comp[i * 2 + 1])];
        }
        ret.push(name);
    }

    var generatedName = Helpers.capitalizeFirstLetter(ret[0]);

    return generatedName;
}
