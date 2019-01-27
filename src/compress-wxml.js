///@ts-check
'use strict';
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var size = require('gulp-size');

var TITLE = 'wxml';
/**
 * 
 * @param {object} config 
 * @param {string|string[]} wxmlsrc
 */
function compressImage(config, wxmlsrc) {
    return gulp.src(wxmlsrc, { base: config.src })
        .pipe(debug({ title: TITLE }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            keepClosingSlash: true
        }))
        .pipe(rename({ 'extname': '.wxml' }))
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist))
}


module.exports = compressImage