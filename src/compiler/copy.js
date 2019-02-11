
///@ts-check
'use strict';
var gulp = require('gulp');
var size = require('gulp-size');

var TITLE = 'copy:';

/**
 * 
 * @param {string} dist 
 * @param {string|string[]} file 
 * @param {string} src
 */
function copy(dist, file, src) {
    return gulp.src(file, src ? { base: src } : undefined)
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(dist));
}

module.exports = copy;