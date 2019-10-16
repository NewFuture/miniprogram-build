///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileImage = require('../compiler/compress-image');
var watchLog = require('../log/watch');

var IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'svg', 'gif',];


function compress(config) {
    /**
     * @param {string|string[]} file
     */
    return function (file) {
        return compileImage(file, config.dist, { base: config.src, ignore: config.exclude });
    }
}

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function () {
        return compress(config)(extToGlob(config, IMAGE_EXTS));
    };
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        var glob = extToGlob(config, IMAGE_EXTS);
        watchLog('image', glob)
        gulp.watch(glob, { ignored: config.exclude, delay: 1200 })
            .on('change', compress(config))
            .on('add', compress(config))
            .on('unlink', unlink(config.src, config.dist));
        cb && cb();
    }
}