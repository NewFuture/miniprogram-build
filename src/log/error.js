///@ts-check
"use strict";
var log = require("fancy-log");
var colors = require("colors");

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
            colors.cyan("<ERROR>" + TITLE),
            colors.red(err.name),
            "\n",
            colors.bgRed(err.message),
            "\n",
            //@ts-ignore
            colors.red.underline(err.relativePath || err.fileName),
            "\n" + (skip ? '' : err.stack + '\n' + err)
        );
        if (skip) {
            return this.emit("end", err);
        } else {
            process.exit(1);
        }
    };
    return logError
};
