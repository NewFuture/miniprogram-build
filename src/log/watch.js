///@ts-check
'use strict';
var colors = require('colors');
var log = require('../log/logger');

/**
 * @param {string} name
 */
module.exports = function (name, files) {
    process.env.SKIP_ERROR = 'true';
    return log.info(
        colors.magenta(name + '-watch:'),
        colors.underline.blue(files)
    );
}