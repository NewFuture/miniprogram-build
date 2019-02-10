///@ts-check
'use strict';
var del = require('del');
var log = require('fancy-log');
var colors = require('ansi-colors');


exports.build = function (config) {
    return function (cb) {
        log(colors.blue('clean:'), config.dist);
        del(config.dist);
        cb & cb();
    };
}