///@ts-check
"use strict";

const colors = require('ansi-colors');

const rainbowColors = ['red', 'yellow', 'green', 'blue', "cyan", 'magenta', "magentaBright", "redBright"];


function colorize(exploded, letter, i) {
    if (letter === ' ') {
        return exploded + letter;
    } else {
        return exploded + colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
};


exports = function (str) {
    return Array.from(str).reduce(colorize, '');
}