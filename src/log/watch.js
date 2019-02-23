///@ts-check
'use strict';
var log = require('fancy-log');
var colors = require('colors/safe');

/**
 * @param {string} name
 */
module.exports = function (name, files) {
    process.env.SKIP_ERROR = 'true';
    return log.info(
        colors.magenta(name + '-watch:'),
        colors.underline.blue(files),
    );
}