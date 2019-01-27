///@ts-check
'use strict';
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var debug = require('gulp-debug');

/**
 * 
 * @param {object} config 
 * @param {string|string[]} wxmlsrc
 */
function compressImage(config, wxmlsrc) {
    return gulp.src(wxmlsrc, { base: config.src })
        .pipe(debug({ title: 'wxml' }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            keepClosingSlash: true
        }))
        .pipe(rename({ 'extname': '.wxml' }))
        .pipe(gulp.dest(config.dist))
}


module.exports = compressImage