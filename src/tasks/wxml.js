///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileWxml = require('../compiler/compress-wxml');
var watchLog = require('../log/watch');

var WXML_EXTS = ['wxml', 'html'];

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function () {
        return compileWxml(config, extToGlob(config, WXML_EXTS));
    };
}
/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        var glob = extToGlob(config, WXML_EXTS);
        watchLog('wxml', glob)
        gulp.watch(glob, { ignored: config.exclude })
            .on('change', function (file) { return compileWxml(config, file); })
            .on('add', function (file) { return compileWxml(config, file); })
            .on('unlink', unlink(config.src, config.dist, '.wxml'));
        cb && cb();

    }
}