///@ts-check
'use strict';
var del = require('del');
var log = require('fancy-log');
var colors = require('colors/safe');


exports.build = function (config) {
    return function () {
        log(colors.blue('clean:'), config.dist);
        return del(config.dist);
    };
}