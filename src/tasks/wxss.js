///@ts-check
'use strict';
var path = require('path');
var gulp = require('gulp');

var extToSrc = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileWxss = require('../compiler/compile-wxss');
var watchLog = require('../log/watch');

var WXSS_EXTS = ['scss', 'sass', 'css', 'wxss'];

/**
 * @param {object} config
 */
function compile(config) {
    return compileWxss(config, extToSrc(config, WXSS_EXTS));
}

/**
 * @param {object} config
 */
exports.build = function (config) {
    return function (cb) {
        compile(config);
        cb && cb();
    };
}

function isAsset(file, config) {
    return config.assets && file.startsWith(path.join(config.src, config.assets));
}

/**
 * @param {object} config
 */
exports.watch = function (config) {
    var update = function (file) {
        // console.warn(file,JSON.stringify(arguments))
        if (isAsset(file, config)) {
            return compile(config);//依赖资源文件更改全部编译
        } else {
            return compileWxss(config, file);
        }
    };

    return function (cb) {
        var glob = extToSrc(config, WXSS_EXTS, true);
        watchLog('wxss', glob)
        gulp.watch(glob, {})
            .on('change', update)
            .on('add', update)
            .on('unlink', function (file) {
                if (isAsset(file, config)) {
                    return compile(config);
                } else {
                    return unlink(config.src, config.dist, '.wxss')(file);
                }
            });
        cb && cb();
    }
}