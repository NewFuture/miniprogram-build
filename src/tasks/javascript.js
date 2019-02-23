///@ts-check
"use strict";
var gulp = require("gulp");
var fs = require("fs");
var path = require("path");
var compileJs = require("../compiler/compile-javascript");
var unlink = require("../lib/unlink");
var extToGlob = require("../lib/ext-to-glob");
var watchLog = require("../log/watch");

var JS_EXTS = ["js", "wxs"];
/**
 * @param {object} config
 */
exports.build = function (config) {
    return function () {
        return compileJs(config, extToGlob(config, JS_EXTS));
    };
};


/**
 * @param {object} config
 */
exports.watch = function (config) {
    return function (cb) {
        var glob = extToGlob(config, JS_EXTS);
        watchLog("js", glob);
        gulp.watch(glob)
            .on("change", function (file) {
                return compileJs(config, file);
            })
            .on("add", function (file) {
                return compileJs(config, file);
            })
            .on("unlink", unlink(config.src, config.dist, ".js"));
        cb && cb();
    };
};
