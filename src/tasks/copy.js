///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var copy = require('../compiler/copy');

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function () {
        // copy(config, config.copy)
        if (config.copy) {
            return copy(config, extToGlob(config, config.copy));
        }
    };
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        if (!config.copy) {
            return;
        }
        var glob = extToGlob(config, config.copy);
        return gulp.watch(glob, {})
            .on('change', function (file) { return copy(config, file); })
            .on('add', function (file) { return copy(config, file); })
            .on('unlink', unlink(config.src, config.dist));
    }
}