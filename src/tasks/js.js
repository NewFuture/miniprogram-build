///@ts-check
'use strict';
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var compileTs = require('../compiler/compile-typescript');
var compileJs = require('../compiler/compile-javascript');
var unlink = require('../lib/unlink');
var extToGlob = require('../lib/ext-to-glob');


var TS_EXTS = ['ts', 'js'];

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function (cb) {
        // 自动判断TS/JS
        if (config.tsconfig || fs.existsSync('tsconfig.json')) {
            config.tsconfig = config.tsconfig || 'tsconfig.json';
            compileTs(config);
        } else {
            compileJs(config, config.src + '/**/*.js');
        }
        cb && cb();
    }
}

/**
 * @param {object} config
 * @param {string} file
 */
function update(config, file) {
    return path.extname(file).toLowerCase() === '.ts' ? compileTs(config, file) : compileJs(config, file);
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        gulp.watch(extToGlob(config, TS_EXTS), {
            ignored: config.src + '/*/**.d.ts',
        }).on('change', function (file) {
            return update(config, file);
        }).on('add', function (file) {
            return update(config, file);
        }).on('unlink', unlink(config.src, config.dist, '.js'));
        cb && cb();
    }
}
