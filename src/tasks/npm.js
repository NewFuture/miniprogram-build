///@ts-check
'use strict';
var path = require('path');

var gulp = require('gulp');
var fs = require('fs');
var log = require('fancy-log');
var colors = require('colors/safe');

var unlink = require('../lib/unlink');
var buildNpm = require('../compiler/build-npm');
// var npmInstall = require('../compiler/npm-install');
var copy = require('../compiler/copy');
var watchLog = require('../log/watch');
// var merge = require('merge-stream');


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
                try {
                    var PKG = require(path.join(process.cwd(), PACKAGE_JSON));
                    if (PKG.dependencies && Object.keys(PKG.dependencies).length > 0) {
                        return buildNpm(config).end(cb);
                    } else {
                        log(
                            colors.cyan('npm:'),
                            colors.gray('No `dependency` was found. Skips!')
                        );
                    }
                } catch (error) {
                    cb(error);
                }
                // fs.exists('node_modules', function (is_modules_exists) {
                //     if (!is_modules_exists) {
                //         log(
                //             colors.red('npm:'),
                //             colors.yellowBright('node_modules/ doesn\'t exist! please run `' + colors.bgRedBright('npm i') + '`'),
                //         );
                //         cb && cb();

                //     } else {
                //         return buildNpm(config).end(cb);
                //     }
                // });
            }
        })
    };
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        watchLog('npm', PACKAGE_JSON);
        gulp.watch(PACKAGE_JSON, {})
            .on('change', function (file) { return copy(config.dist, file, config.src); })
            .on('add', function () { exports.build(config)(); })
            .on('unlink', unlink(config.src, config.dist));
        cb && cb();
    }
}