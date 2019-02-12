///@ts-check
'use strict';
var gulp = require('gulp');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileJson = require('../compiler/compile-json');
var watchLog = require('../log/watch');

var JSON_EXTS = ['json', 'jsonc', 'cjson'];

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function () {
        return compileJson(config, extToGlob(config, JSON_EXTS));
    };
}
/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        var glob = extToGlob(config, JSON_EXTS);
        watchLog('json', glob)
        gulp.watch(glob, {})
            .on('change', function (file) { return compileJson(config, file); })
            .on('add', function (file) { return compileJson(config, file); })
            .on('unlink', unlink(config.src, config.dist, '.json'))
            ;
        cb && cb();
    }
}