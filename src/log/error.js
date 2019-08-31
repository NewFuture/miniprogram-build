///@ts-check
"use strict";
var colors = require("ansi-colors");
var log = require("./logger");
const color = require("./color");

/**
 * @param {string} TITLE
 */
module.exports = function (TITLE) {
    /**
     * @param {Error} err
     */
    function logError(err) {
        const skip = process.env.SKIP_ERROR;
        log.error(
            color(TITLE),
            colors.bold.redBright("[×]"),
            colors.red(err.name),
            "\n" +
            colors.bgRed(err.message),
            "\n" +
            //@ts-ignore
            colors.red.underline(err.fileName || err.relativePath),
            "\n" + (skip ? '' : err.stack ? (err.stack + '\n' + err) : JSON.stringify(err, null, 2).substring(0, 2000))
        );
        if (skip) {
            if (this && this.emit) {
                return this.emit("end", err);
            }
        } else {
            process.exit(1);
        }
    };
    return logError
};
