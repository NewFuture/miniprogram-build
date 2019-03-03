///@ts-check
'use strict';
var del = require('del');
var colors = require('ansi-colors');
var log = require('../log/logger');
var color = require('../log/color');



exports.build = function (config) {
    return function () {
        log(color('clean:'), config.dist);
        return del(config.dist);
    };
}