
///@ts-check
'use strict';
var gulp = require('gulp');
var size = require('gulp-size');

var TITLE = 'copy:';

/**
 * 
 * @param {object} config 
 * @param {string|string[]} file 
 */
function copy(config, file) {
    // file = file || ([config.src + '/**/*', '!' + config.src + '/**/*.{ts,json,jsonc,scss,sass,css,png,jpg,jpeg,svg,gif}']);
    return file ? gulp.src(file, { base: config.src })
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist)) : null;
}

module.exports = copy;