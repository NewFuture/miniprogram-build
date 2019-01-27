///@ts-check
'use strict';
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

/**
 * 
 * @param {object} config 
 * @param {string|string[]} imgsrc
 */
function compressImage(config, imgsrc) {
    return gulp.src(imgsrc, { base: config.src })
        .pipe(imagemin({verbose:true}))
        .pipe(gulp.dest(config.dist))
}


module.exports = compressImage