///@ts-check
"use strict";
var colors = require("ansi-colors");
var log = require("./logger");

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
            "\n" + (skip ? '' : err.stack ? (err.stack + '\n' + err):JSON.stringify(err,null,2))
        );
        if (skip) {
            return this.emit("end", err);
        } else {
            process.exit(1);
        }
    };
    return logError
};
