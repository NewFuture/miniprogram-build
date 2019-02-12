///@ts-check
'use strict';
var log = require('fancy-log');
var colors = require('ansi-colors');


/**
 * @param {string} TITLE
 */
module.exports = function (TITLE) {
    return function (err) {
        log.error(
            colors.cyan('<ERROR>' + TITLE),
            colors.red(err.name),
            '\n',
            colors.red(err.message),
            '\n',
            colors.red.underline(err.fileName),
            '\n'
        );
        if (process.env.SKIP_ERROR) {
            return this.emit('end', err);
        } else {
            process.exit(1);
        }
    }
}