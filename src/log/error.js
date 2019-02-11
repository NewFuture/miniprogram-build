///@ts-check
'use strict';
var log = require('fancy-log');
var colors = require('ansi-colors');

/**
 * @param {string} TITLE
 */
module.exports = function (TITLE) {
    return function (err) {
        log.error(colors.cyan(TITLE),
            colors.red(err.name),
            '\n', colors.red(err.message),
            ' in ',
            colors.red.underline(err.fileName));
        return this.emit('end');
    }
}