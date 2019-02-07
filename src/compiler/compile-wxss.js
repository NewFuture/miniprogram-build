///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('gulp-debug');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var inline = require('../lib/inline');
var empty = require('../lib/empty');
var size = require('gulp-size');

var TITLE = 'wxss:';
/**
 * 编译scss
 * @param {object} config
 * @param {string|string[]} scssFile  编译源 
 */
function compileScss(config, scssFile) {
    return gulp.src(scssFile, { base: config.src })
        .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(debug({ title: TITLE }))
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: config.release ? 'compressed' : 'expanded',
            includePaths: ['node_modules'],
            sourceMapEmbed: !config.release,
        }))
        .on('error', function (err) {
            sass.logError.call(this, err);
            this.emit('end');
        })
        .pipe(inline())
        .pipe(config.release ? postcss([cssnano()]) : empty())
        .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(rename({ 'extname': '.wxss' }))
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist))
}

module.exports = compileScss