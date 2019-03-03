///@ts-check
"use strict";
const colors = require('ansi-colors');

const availableColors = [
    "greenBright",
    "yellowBright",
    "blueBright",
    "magentaBright",
    "cyanBright",
    "whiteBright",
    // "gray",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
];

const availableStyle = [
    "dim",
    "bold",
    "italic",
    // "underline",
    "reset",
]
const maps = {}

let index = 0;

/**
 * 
 * @param {string} str
 * @returns {string} 
 */
function color(str) {
    str = str && str.trim();
    if (!maps[str]) {
        maps[str] = colors
        [availableStyle[index % availableStyle.length]]
        [availableColors[index++ % availableColors.length]]
            (str);
    }
    return maps[str];
}

module.exports = color;