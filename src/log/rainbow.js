///@ts-check
"use strict";

const colors = require('../common').colors;

const rainbowColors = [
    'red',
    'yellowBright',
    'green',
    'blue',
    "cyan",
    'magentaBright',
    "whiteBright",
    // "magentaBright",
    "redBright"
];

function colorize(exploded, letter, i) {
    if (letter === ' ') {
        return exploded + letter;
    } else {
        return exploded + colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
};
module.exports =
    /**
     * 
     * @param {string} str
     * @returns {string} 
     */
    function rainbow(str) {
        return Array.from(str).reduce(colorize, '');
    }