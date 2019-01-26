#!/usr/bin/env node

//@ts-check

// var path = require('path');
'use strict';

var gulp = require('gulp');
var encode = require('./src/inline');

var through = require('through2');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
// module.exports = 
function task (opts) {

    function rebase(file, encoding, callback) {
        var self = this;

        encode.stylesheet(file, opts, function (err, src) {
            if (err) {
                console.error(err);
            }
            file.contents = new Buffer(src);

            self.push(file);
            callback();
        });

    }

    return through.obj(rebase);
};
gulp.task('default', function () {
    return gulp.src(['*.css'])
    .pipe(task())
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('css'));
})

gulp.task('default')(console.log);