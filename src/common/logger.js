
"use strict";

// import colors from "ansi-colors";
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
                return colors.yellowBright('[') + colors.gray(time) + colors.yellowBright(']');
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
    // @ts-ignore
    console.log.apply(console, Array.prototype.concat.apply([getTime()], arguments));
    return this;
}

function info() {
    // @ts-ignore
    console.info.apply(console, Array.prototype.concat.apply([getTime(-1)], arguments));
    return this;
}

function warn() {
    // @ts-ignore
    console.warn.apply(console, Array.prototype.concat.apply([getTime(1)], arguments));
    return this;
}

function error() {
    // @ts-ignore
    console.error.apply(console, Array.prototype.concat.apply([getTime(2)], arguments));
    return this;
}

/**
 * 
 */
// const logger = log 
// logger.log = log
// logger.info = info
// logger.warn = warn
// logger.error = error

// { log, info, warn, error }

//     info,
//     warn,
//     error,
// }
module.exports = log;
module.exports.log = log;
module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;
// module.exports.colors = colors
// export default logger

// export {
//     log,
//     info,
//     warn,
//     error,
//     colors
// };