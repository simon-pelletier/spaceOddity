import * as Setup from '../setup';
import * as Helpers from '../helpers/helpers';

export default function generateUnivers(scene) {
    var univers = [];

    var marginWorld = 50; // Marge de position des Systems sur la Map

    for (var i = 0; i < Setup.NUMBER_MAX_OF_SYSTEMS; i++) {
        var systemColor = '0x' + Helpers.getRandomColor();
        var systemName = nameGenerator(1) + nameNumberGenerator();
        var system = {};
        if (i === 0) {
            system = {
                name: systemName,
                systemX: Setup.WIDTH / 2,
                systemY: Setup.HEIGHT / 2,
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
                    Setup.WIDTH - marginWorld
                ),
                systemY: Helpers.getRandomNumber(
                    marginWorld,
                    Setup.HEIGHT - marginWorld
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
/* ========================================================================== */
/*                              SYSTEM GENERATOR                              */
/* ========================================================================== */

function systemGenerator(systemName, systemColor) {
    var systemGenerated = [];

    // Définit le nombre de planetes dans le systeme
    var planetNumber = Helpers.getRandomNumber(3, Setup.NUMBER_MAX_OF_PLANETS);

    var satellites = [];
    satellites.push('none');
    // Création de l'étoile
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

    // Ajoute le soleil au tableau du systeme
    systemGenerated.push(star);

    // Ajout des planetes dans le tableau du system
    for (var i = 0; i < planetNumber; i++) {
        systemGenerated.push(planetGenerator(i));
    }

    return systemGenerated;
}

/* -------------------------- System Name Generator ------------------------- */

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

/* ========================================================================== */
/*                              PLANET GENERATOR                              */
/* ========================================================================== */

function planetGenerator(i) {
    // Chance d'avoir un satellite
    var satelliteChances = Helpers.getRandomNumber(
        1,
        Setup.ONE_PER_THIS_CHANCE_TO_HAVE_A_SAT
    );

    // Tableau temporaire de satellites à envoyer sur la planète
    var satellites = [];
    if (satelliteChances === 1) {
        satellites.push(satelliteGenerator());
    } else {
        satellites.push('none');
    }

    // Création d'une planete
    var planet = {
        name: nameGenerator(1),
        size: Helpers.getRandomNumber(10, 20),
        distance: Helpers.getRandomNumber(50, Setup.HEIGHT / 2),
        mass: Helpers.getRandomNumber(200, 2000),
        speed: Helpers.getRandomNumber(10000, 30000),
        offset: Helpers.getRandomNumberFloat(0, 360),
        color: '0x' + Helpers.getRandomColor(),
        bgColor: '0x' + Helpers.getRandomColor(),
        satellites: satellites,
        materials: materialsGenerator(),
        visited: false,
        gravity: Helpers.getRandomNumberFloat(0, 1),
        hostility: Helpers.getRandomNumber(0, 100)
    };

    return planet;
}

/* --------------------------- Materials Generator -------------------------- */

function materialsGenerator() {
    var materials = [];
    // var chanceToHaveMaterials = Helpers.getRandomNumber(12, Setup.NUMBER_MAX_OF_MATERIALS); // DEBUG à régler sur (0,3) - MAX 12

    for (var i = 0; i < 12; i++) {
        var sortOfMaterial = Helpers.getRandomNumber(0, 10);
        if (sortOfMaterial == 0) {
            var material = {
                id: i,
                sort: 'geyser',
                point: i,
                quantity: Helpers.getRandomNumber(500, 2000)
            };
        } else if (sortOfMaterial == 1) {
            var material = {
                id: i,
                sort: 'rawMat',
                point: i,
                quantity: Helpers.getRandomNumber(500, 2000)
            };
        } else {
            var material = {
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

/* ========================================================================== */
/*                             SATELLITE GENERATOR                            */
/* ========================================================================== */

function satelliteGenerator() {
    // Création d'un satellite
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

/* ========================================================================== */
/*                          ASTEROIDS SPAWN GENERATOR                         */
/* ========================================================================== */

function randomAsteroidSpawn() {
    // Asteroid Position
    var asteroidX = '';
    var asteroidY = '';

    // Asteroid marge haute et basse pour le Spawn
    var lowZone = 200;
    var highZone = 20;

    // Côté sur lequel l'astéroide est positionné
    var side = Helpers.getRandomNumber(0, 3);

    if (side === 0) {
        asteroidX = Helpers.getRandomNumber(-lowZone, -highZone);
        asteroidY = Helpers.getRandomNumber(-lowZone, Setup.HEIGHT + lowZone);
    } else if (side === 1) {
        asteroidX = Helpers.getRandomNumber(-lowZone, Setup.WIDTH + lowZone);
        asteroidY = Helpers.getRandomNumber(-lowZone, -highZone);
    } else if (side === 2) {
        asteroidX = Helpers.getRandomNumber(
            Setup.WIDTH + highZone,
            Setup.WIDTH + lowZone
        );
        asteroidY = Helpers.getRandomNumber(-lowZone, Setup.HEIGHT + lowZone);
    } else if (side === 3) {
        asteroidX = Helpers.getRandomNumber(-lowZone, Setup.WIDTH + lowZone);
        asteroidY = Helpers.getRandomNumber(
            Setup.HEIGHT + highZone,
            Setup.HEIGHT + lowZone
        );
    }

    // Position de départ de l'astéroide
    var asteroidStartPoint = {
        x: asteroidX,
        y: asteroidY
    };

    return asteroidStartPoint;
}

/* ========================================================================== */
/*                          REALISTIC NAME GENERATOR                          */
/* ========================================================================== */

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
