
///@ts-check
'use strict';
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var debug = require("gulp-debug");
var size = require('gulp-size');
var empty = require('../lib/empty');
var replace = require('../lib/multi-replace');

var TITLE = 'javascript:';
/**
 * 编译TS
 * @param {object} config * 
 * @param {string|string[]} jsFile
 */
function compilejs(config, jsFile) {
    return gulp.src(jsFile, { base: config.src, sourcemaps: !config.release })
        .pipe(debug({ title: TITLE }))
        .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(replace(config.var, undefined, "{{", "}}"))
        .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist));
}
module.exports = compilejs