///@ts-check
'use strict';
var gulp = require('gulp');
var fs = require('fs');
var log = require('fancy-log');
var colors = require('ansi-colors');
var debug = require('gulp-debug');

var unlink = require('../lib/unlink');
var buildNpm = require('../compiler/build-npm');
// var copy = require('../compiler/copy');

var PACKAGE_JSON = 'package.json';
/**
 * @param {object} config
 */
exports.build = function (config) {
    return function () {
        if (!fs.existsSync(PACKAGE_JSON)) {
            return;
        }
        if (!fs.existsSync('node_modules')) {
            log(
                colors.red('npm:'),
                colors.yellowBright('node_modules/ doesn\'t exist! please run `' + colors.bgRedBright('npm i') + '`'),
            );
            return;
        } else {
            return buildNpm(config);
        }
    };
}

/**
 * @param {object} config
 */
function package_copy(config) {
    return function () {
        gulp.src(PACKAGE_JSON)
            ///@ts-ignore
            .pipe(debug({ title: 'npm-copy', showCount: false }))
            .pipe(gulp.dest(config.dist));
    }
}
/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        return gulp.watch(PACKAGE_JSON, {})
            .on('change', package_copy(config))
            .on('add', exports.build(config))
            .on('unlink', unlink(config.src, config.dist));
    }
}