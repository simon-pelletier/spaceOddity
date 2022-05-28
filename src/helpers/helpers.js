/**
 *
 * @namespace Randomizers
 */

/**
 * Retourne un entier aléatoire
 * @memberof Randomizers
 * @param {number} min
 * @param {number} max
 */
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Retourne un nombre aléatoire
 * @memberof Randomizers
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomNumberFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Retourne une direction aléatoire (float - positif et négatif)
 * @memberof Randomizers
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomVector2(min, max) {
    var randomBooleanX = Math.random() >= 0.5;
    var randomBooleanY = Math.random() >= 0.5;
    var x = Math.random() * (max - min) + min;
    var y = Math.random() * (max - min) + min;
    if (randomBooleanX) {
        x = -x;
    }
    if (randomBooleanY) {
        y = -y;
    }
    var vector = {
        x: x,
        y: y
    };
    return vector;
}

/**
 * Retourne une couleur aléatoire
 * @memberof Randomizers
 * @returns {number}
 */
export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Retourne une lettre aléatoire
 * @memberof Randomizers
 * @returns {number}
 */
export function getRandomLetter() {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var randomPosition = getRandomNumber(0, alphabet.length - 1);
    var randomLetter = alphabet[randomPosition];
    return randomLetter;
}

/**
 *
 * @namespace Converters
 */

/**
 * Retourne une String avec le premier char en capital
 * @memberof Converters
 * @param {string} string
 * @returns {number}
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Retourne une couleur Hexa (000000) en tableau RGB
 * @memberof Converters
 * @param {hex} hex
 * @returns {hex}
 */
export function convertHexToRgbArray(hex) {
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var result = [Number(r), Number(g), Number(b)];
    return result;
}

/**
 *
 * @namespace Physics
 */

/**
 * Retourne la distance entre deux points
 * @memberof Physics
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function getDistanceBetween(a, b) {
    var distanceX = Math.abs(a.x - b.x);
    var distanceY = Math.abs(a.y - b.y);
    var distance = distanceX + distanceY;
    return distance;
}

/**
 * Retourne un angle à partir de deux points
 * @memberof Physics
 * @param {number} cx
 * @param {number} cy
 * @param {number} ex
 * @param {number} ey
 * @returns {number}
 */
export function getAngle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
}

/**
 *
 * @namespace Navigation
 */

/**
 * Ouverture d'url
 * @memberof Navigation
 * @param {string} url
 */
export function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

// /**
//  * Retourne le nom de la planète visitée actuellement
//  * @param {string} system
//  * @param {string} planet
//  * @returns {string}
//  */
// export function getCurrentPlanetName(system, planet) {
//     if (planet < 0) {
//         return 'none';
//     } else {
//         return world[system].system[planet].name;
//     }
// }

// /**
//  * Retourne le nombre de charges qu'il faut pour une distance HS
//  * @param {number} distance
//  * @returns {number}
//  */
// export function chargesToGo(distance) {
//     var charges = (distance / 100).toFixed(0);
//     return charges;
// }
