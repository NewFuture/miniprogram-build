
///@ts-check
'use strict';
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var empty = require('./lib/empty');
var debug = require("gulp-debug");
/**
 * 编译TS
 * @param {object} config * 
 * @param {string} [tsFile] 
 */
function compileTS(config, tsFile) {
    var tsProject = ts.createProject(config.tsconfig);
    var src = tsFile ? gulp.src(tsFile, { base: config.src, sourcemaps: !config.release }) : tsProject.src();
    return src
        .pipe(debug({ title: 'typescript' }))
        .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(tsProject(ts.reporter.fullReporter(true)))
        .js
        .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(gulp.dest(config.dist));
}
module.exports = compileTS