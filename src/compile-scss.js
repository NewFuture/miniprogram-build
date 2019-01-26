///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var inline = require('./lib/inline');
var empty = require('./lib/empty');

/**
 * 编译scss
 * @param {string|string[]} scssFile - 无则编译所有
 * @param {object} config
 */
function compileScss(scssFile, config) {
    scssFile = scssFile;
    return gulp.src(scssFile, { base: config.src, sourcemaps: !config.release })
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: config.release ? 'compressed' : 'expanded',
            includePaths: ['node_modules'],
            sourceMapEmbed: !config.release,
        }).on('error', sass.logError))
        .pipe(gulpif(Boolean(config.debug), debug({ title: '`compileScss` Debug:' })))
        .pipe(inline())
        .pipe(config.release ? postcss([cssnano()]) : empty())
        .pipe(rename({ 'extname': '.wxss' }))
        // .pipe(replace('.scss', '.wxss'))
        .pipe(gulp.dest(config.dist, {
            // @ts-ignore
            sourcemaps: !config.release
        }))
}

module.exports = compileScss