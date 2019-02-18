
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
        .pipe(gulp.dest(dist))
        .pipe(size({ title: TITLE, showFiles: true }))
        ;
}

module.exports = copy;