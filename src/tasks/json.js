///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileJson = require('../compiler/compile-json');

var JSON_EXTS = ['json', 'jsonc', 'cjson'];

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function (cb) {
        compileJson(config, extToGlob(config, JSON_EXTS));
        cb && cb();

    };
}
/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        gulp.watch(extToGlob(config, JSON_EXTS), {})
            .on('change', function (file) { return compileJson(config, file); })
            .on('add', function (file) { return compileJson(config, file); })
            .on('unlink', unlink(config.src, config.dist, '.json'))
            ;
        cb && cb();
    }
}