///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var copy = require('../compiler/copy');
var watchLog = require('../log/watch');

/**
 * @param {object} config
 */
function copyTo(config) {
    /**
     * @param {string|string[]} file
     */
    return function (file) {
        return copy(config.dist, file, { base: config.src, ignore: config.exclude });
    }
}

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function (cb) {
        if (config.copy) {
            return copyTo(config)(extToGlob(config, config.copy));
        }
        cb && cb();
    };
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        if (config.copy) {
            watchLog('copy', config.copy);
            gulp.watch(extToGlob(config, config.copy), { ignored: config.exclude })
                .on('change', copyTo(config))
                .on('add', copyTo(config))
                .on('unlink', unlink(config.src, config.dist));
        }
        cb && cb();
    }
}