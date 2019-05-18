///@ts-check
'use strict';
// var del = require('del');

var log = require('../log/logger');
var color = require('../log/color');
const rm = require('rimraf');


exports.build = function (config) {
    return function (cb) {
        log(color('clean:'), config.dist);
        rm(config.dist,cb);
        // return (config.dist);
    };
}
