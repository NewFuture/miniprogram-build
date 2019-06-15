///@ts-check
"use strict";
const colors = require('../common').colors;

const availableColors = [
    "cyanBright",
    "magentaBright",
    "greenBright",
    "blueBright",
    // "yellowBright",
    // "whiteBright",
    // "gray",
    // "yellow",
    "cyan",
    "green",
    "blue",
    // "magenta", // cannot display in power shell
];

const availableStyle = [
    "reset",
    // "bold",
    "italic",
    "dim",
    // "underline",
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
        maps[str] = colors.gray.dim(index+'.')+colors
        .reset
        [availableStyle[index % availableStyle.length]]
        [availableColors[index++ % availableColors.length]]
        .bold(str);
    }
    return maps[str];
}

module.exports = color;