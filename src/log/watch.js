///@ts-check
'use strict';
var colors = require('../common').colors;
var log = require('../common').logger;

/**
 * @param {string} name
 */
module.exports = function (name, files) {
    process.env.SKIP_ERROR = 'true';
    return log.info(
        colors.magentaBright(name + '-watch:'),
        colors.underline.blueBright(files)
    );
}