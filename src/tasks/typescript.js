///@ts-check
"use strict";
var gulp = require("gulp");
var fs = require("fs");

var log = require('fancy-log');
var colors = require('colors/safe');

var compileTs = require("../compiler/compile-typescript");
var unlink = require("../lib/unlink");
var extToGlob = require("../lib/ext-to-glob");
var watchLog = require("../log/watch");

var TS_EXTS = ["ts"];
/**
 * @param {object} config
 */
exports.build = function (config) {
    if (config.tsconfig || fs.existsSync("tsconfig.json")) {
        return function () {
            config.tsconfig = config.tsconfig || "tsconfig.json";
            return compileTs(config);
        }
    } else {
        log(
            colors.cyan('npm:'),
            colors.gray('`tsconfig.json` was found. Skip typescript compilation!'),
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
        var glob = extToGlob(config, TS_EXTS);
        watchLog("js", glob);
        gulp.watch(glob, {
            ignored: config.src + "/*/**.d.ts",
        })
            .on("change", function (file) {
                return compileTs(config, file);
            })
            .on("add", function (file) {
                return compileTs(config, file);
            })
            .on("unlink", unlink(config.src, config.dist, ".js"));
        cb && cb();
    };
};
