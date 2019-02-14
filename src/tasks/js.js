///@ts-check
"use strict";
var gulp = require("gulp");
var fs = require("fs");
var path = require("path");
var compileTs = require("../compiler/compile-typescript");
var compileJs = require("../compiler/compile-javascript");
var unlink = require("../lib/unlink");
var extToGlob = require("../lib/ext-to-glob");
var watchLog = require("../log/watch");
var merge = require("merge-stream");

var TS_EXTS = ["ts"];
var JS_EXTS = ["js", "wxs"];
/**
 * @param {object} config
 */
exports.build = function(config) {
    return function() {
        // 自动判断TS/JS
        var stream = compileJs(config, extToGlob(config, JS_EXTS));
        if (config.tsconfig || fs.existsSync("tsconfig.json")) {
            config.tsconfig = config.tsconfig || "tsconfig.json";
            stream = merge(stream, compileTs(config));
        }
        return stream;
    };
};

/**
 * @param {object} config
 * @param {string} file
 */
function update(config, file) {
    return path.extname(file).toLowerCase() === ".ts" ? compileTs(config, file) : compileJs(config, file);
}

/**
 * @param {object} config
 */
exports.watch = function(config) {
    return function(cb) {
        var glob = extToGlob(config, TS_EXTS.concat(JS_EXTS));
        watchLog("js", glob);
        gulp.watch(glob, {
            ignored: config.src + "/*/**.d.ts",
        })
            .on("change", function(file) {
                return update(config, file);
            })
            .on("add", function(file) {
                return update(config, file);
            })
            .on("unlink", unlink(config.src, config.dist, ".js"));
        cb && cb();
    };
};
