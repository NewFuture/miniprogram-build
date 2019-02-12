///@ts-check
'use strict';
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var err = require('../log/error');

var TITLE = 'image:';
/**
 * 
 * @param {string|string[]} imgsrc
 * @param {string} src 
 * @param {string} dist 
 * 
 */
function compressImage(imgsrc, src, dist) {
    return gulp.src(imgsrc, { base: src })
        // .pipe(debug({ title: 'image:' }))
        .pipe(imagemin({ verbose: true }))
        .on('error', err(TITLE))
        .pipe(gulp.dest(dist))
}


module.exports = compressImage