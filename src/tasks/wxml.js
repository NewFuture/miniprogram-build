///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileWxml = require('../compiler/compress-wxml');

var WXML_EXTS = ['wxml', 'html'];

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function (cb) {
        compileWxml(config, extToGlob(config, WXML_EXTS));
        cb && cb();
    };
}
/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        gulp.watch(extToGlob(config, WXML_EXTS))
            .on('change', function (file) { return compileWxml(config, file); })
            .on('add', function (file) { return compileWxml(config, file); })
            .on('unlink', unlink(config.src, config.dist, '.wxml'));
        cb && cb();

    }
}