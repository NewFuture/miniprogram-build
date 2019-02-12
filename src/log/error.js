///@ts-check
'use strict';
var log = require('fancy-log');
var colors = require('ansi-colors');
var gulp = require('gulp');

/**
 * 
 * @param {string} name 
 */
function isWatchTask(name) {
    return name && name.indexOf('watch') >= 0;
}

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
        var args = (process.argv.slice(2) || []);
        if (args.length > 0 && args.every(isWatchTask)) {
            return this.emit('end', err);
        } else {
            process.exit(1);
        }
    }
}