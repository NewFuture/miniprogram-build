///@ts-check
'use strict';
var gulp = require('gulp');
var fs = require('fs');
var log = require('fancy-log');
var colors = require('ansi-colors');

var unlink = require('../lib/unlink');
var buildNpm = require('../compiler/build-npm');
var copy = require('../compiler/copy');

var PACKAGE_JSON = 'package.json';
/**
 * @param {object} config
 */
exports.build = function (config) {
    return function (cb) {
        fs.exists(PACKAGE_JSON, function (is_json_exists) {
            if (!is_json_exists) {
                cb && cb();
            } else {
                fs.exists('node_modules', function (is_modules_exists) {
                    if (!is_modules_exists) {
                        log(
                            colors.red('npm:'),
                            colors.yellowBright('node_modules/ doesn\'t exist! please run `' + colors.bgRedBright('npm i') + '`'),
                        );
                        cb && cb();

                    } else {
                        return buildNpm(config).end(cb);
                    }
                });
            }
        })
    };
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        gulp.watch(PACKAGE_JSON, {})
            .on('change', function (file) { return copy(config.dist, file, config.src); })
            .on('add', function () { exports.build(config)(); })
            .on('unlink', unlink(config.src, config.dist));
        cb && cb();
    }
}