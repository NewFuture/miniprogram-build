///@ts-check
"use strict";
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var debug = require("gulp-debug");
var size = require("gulp-size");
var rename = require("gulp-rename");
var empty = require("../lib/empty");
var replace = require("../lib/multi-replace");
var error = require("../log/error");

const wxtsConfig = {
    target: "es5",
    downlevelIteration: true,//Provide full support for iterables in for..of, spread and destructuring when targeting ES5 or ES3.
    isolatedModules: true,//Transpile each file as a separate module (similar to “ts.transpileModule”).
    noLib: true,
    lib: ['es5']
}

const defaultConfig =
{
    allowJs: true,
    alwaysStrict: true,
    checkJs: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    strictBindCallApply: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    strictNullChecks: true,
}
var TITLE = "wxts:";
/**
 * 编译TS
 * @param {object} config *
 * @param {string|string[]} tsFile
 * @param {any} tsconfig 
 */
function compileWxts(config, tsFile, tsconfig) {
    var ts = require("gulp-typescript");
    var newConfig = Object.assign({}, defaultConfig, tsconfig, wxtsConfig);
    return gulp.src(tsFile, { base: config.src, sourcemaps: !config.release })
        .pipe(debug({ title: TITLE }))
        .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(replace(config.var, undefined, "{{", "}}"))
        .pipe(ts(newConfig, ts.reporter.fullReporter(false)))
        .on("error", error(TITLE))
        .js.pipe(config.release ? empty() : sourcemaps.write())
        .pipe(rename({ extname: ".wxs" }))
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true }));
}
module.exports = compileWxts;
