
///@ts-check
"use strict";

const colors = require("ansi-colors");

const noColor = process.argv.indexOf('--no-color') > 0;

// function addColor(str) {
//     if (process.argv.indexOf('--no-color') > 0) {
//         return str;
//     }

//     return colors.gray(str);
// }

function getTime(level) {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    if (noColor) {
        return '[' + time + ']';
    } else {
        switch (level) {
            case 1:
                return colors.yellow('[') + colors.gray(time) + colors.yellow(']');
            case 2:
                return colors.red('[') + colors.gray(time) + colors.red(']');
            case -1:
                return colors.gray('[') + colors.gray(time) + colors.gray(']');
            default:
                return '[' + colors.gray(time) + ']';
        }

    }
}


function log() {
    console.log.apply(console, Array.prototype.concat.apply([getTime()], arguments));
    return this;
}

function info() {
    console.info.apply(console, Array.prototype.concat.apply([getTime(-1)], arguments));
    return this;
}

function warn() {
    console.warn.apply(console, Array.prototype.concat.apply([getTime(1)], arguments));
    return this;
}

function error() {
    console.error.apply(console, Array.prototype.concat.apply([getTime(2)], arguments));
    return this;
}

module.exports = log;
module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;