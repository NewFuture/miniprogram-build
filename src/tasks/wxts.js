///@ts-check
"use strict";
var gulp = require("gulp");
var fs = require("fs");

var colors = require('ansi-colors');
var json5 = require('json5');

var log = require('../log/logger');
const color = require('../log/color');

var compileWxts = require("../compiler/compile-wxts");
var unlink = require("../lib/unlink");
var extToGlob = require("../lib/ext-to-glob");
var watchLog = require("../log/watch");

var WXTS_EXTS = ["wxts"];
function compile(config, file) {
    var tsconfig = {};
    if (config.tsconfig) {
        var buff = fs.readFileSync(config.tsconfig);
        tsconfig = json5.parse(buff.toString());
    }
    return compileWxts(config, file, tsconfig);
}
/**
 * @param {object} config
 */
exports.build = function (config) {
    if (config.tsconfig || fs.existsSync("tsconfig.json")) {
        return function () {
            config.tsconfig = config.tsconfig || "tsconfig.json";
            return compile(config, extToGlob(config, WXTS_EXTS))
        }
    } else {
        log.info(
            color('wxts:'),
            colors.gray('`tsconfig.json` was not found. Skip WXTS(WeiXin TypesSript) compilation!')
        );
        return function (cb) {
            cb && cb();
        }
    }
};

/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        var glob = extToGlob(config, WXTS_EXTS);
        watchLog("wxts", glob);
        gulp.watch(glob, {
            ignored: config.src + "/*/**.d.ts",
        })
            .on("change", function (file) {
                return compile(config, file);
            })
            .on("add", function (file) {
                return compile(config, file);
            })
            .on("unlink", unlink(config.src, config.dist, ".wxs"));
        cb && cb();
    };
};
