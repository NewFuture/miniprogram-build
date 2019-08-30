///@ts-check
"use strict";
const colors = require("ansi-colors");
const color = require("./color");
const log = require("./logger");

/**
 * @param {string} TITLE
 * @param {string} [sub]
 */
module.exports = function(TITLE, sub) {
    TITLE = color(TITLE);
    if (sub) {
        TITLE += " " + colors.whiteBright(`<${colors.bold.underline(sub)}>`);
    }
    /**
     * @param {any} info
     */
    function logError(info) {
        const skip = process.env.NO_WARN;
        if (!skip) {
            if (typeof info === "string" || !info) {
                log.warn(TITLE, info || "");
            } else {
                log.warn(TITLE, colors.yellowBright(info.message || ""), colors.gray.bgYellowBright.bold(info.code || ""));

                if (info.loc) {
                    log.warn(
                        colors.gray("↓"),
                        colors.bgYellow.gray("warning"),
                        "@line",
                        colors.yellowBright(info.loc.line),
                        "col",
                        colors.yellowBright(info.loc.column),
                        "in",
                        colors.blue.underline(info.loc.file || ""),
                        colors.gray("↓\n") + info.frame,
                    );
                }
                if (info.url) {
                    log.warn("see →", colors.blue.underline(info.url), "for warning detail.");
                }
            }
        }
    }
    return logError;
};
