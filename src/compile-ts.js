
///@ts-check
'use strict';
var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var empty = require('./lib/empty');

/**
 * 编译TS
 * @param {object} config * 
 * @param {string} [tsFile] 
 */
function compileTS(config,tsFile) {
    var tsProject = ts.createProject(config.tsconfig);
    var src = tsFile ? gulp.src(tsFile, { base: config.src, sourcemaps: !config.release }) : tsProject.src();
    return src.pipe(config.release ? empty() : sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(gulp.dest(config.dist));
}
module.exports = compileTS