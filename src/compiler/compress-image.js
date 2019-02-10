///@ts-check
'use strict';
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

/**
 * 
 * @param {string|string[]} imgsrc
 * @param {string} src 
 * @param {string} dist 
 * 
 */
function compressImage(imgsrc, src, dist) {
    return gulp.src(imgsrc, { base: src })
        // .pipe(debug({ title: 'image' }))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest(dist))
}


module.exports = compressImage