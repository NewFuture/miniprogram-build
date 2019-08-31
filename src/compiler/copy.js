
///@ts-check
'use strict';
var gulp = require('gulp');
var size = require('../log/size');

var TITLE = 'copy:';

/**
 * 
 * @param {string} dist 
 * @param {string|string[]} file 
 * @param {{base:string,ignore?:any}} opt
 */
function copy(dist, file, opt) {
    return gulp.src(file, opt)
        .pipe(gulp.dest(dist))
        .pipe(size({ title: TITLE, showFiles: true }))
        ;
}

module.exports = copy;