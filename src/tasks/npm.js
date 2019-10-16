///@ts-check
'use strict';
var path = require('path');

var gulp = require('gulp');
var fs = require('fs');
var colors = require('ansi-colors');

var log = require('../log/logger');
const color = require('../log/color');

var unlink = require('../lib/unlink');
const npm = require('../lib/npm-dependency');

var buildNpm = require('../compiler/build-npm');
// var npmInstall = require('../compiler/npm-install');
// var copy = require('../compiler/copy');
// var rollup = require('rollup')
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
                    const dependencies = npm.getDependencies(process.cwd());
                    if (dependencies && Object.keys(dependencies).length > 0) {
                        fs.exists('node_modules', function (is_modules_exists) {
                            if (!is_modules_exists) {
                                log.error(
                                    color('npm:'),
                                    colors.yellowBright('node_modules/ doesn\'t exist! please run `' + colors.bgRedBright('npm i') + '`'),
                                );
                                cb && cb(new Error("node_modules/ doesn't exist!"));

                            } else {
                                return buildNpm(process.cwd(), config.dist, Object.keys(dependencies))(cb);
                            }
                        });
                    } else {
                        log.info(
                            color('npm:'),
                            colors.gray('No `dependency` was found. Skips!')
                        );
                        cb && cb();
                    }
                } catch (error) {
                    log.error(error);
                    cb && cb(error);
                }
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
        gulp.watch(PACKAGE_JSON, { delay: 1200, ignorePermissionErrors: true })
            .on('change', function () { exports.build(config)(); })
            .on('add', function () { exports.build(config)(); })
            .on('unlink', unlink("miniprogram_npm", config.dist));
        cb && cb();
    }
}