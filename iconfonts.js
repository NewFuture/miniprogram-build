///@ts-check
'use strict';

// var path = require('path');
var gulp = require('gulp');
// var base64 = require('./src/font-base64');
var iconfont = require('gulp-iconfont');
var base64Stream = require('base64-stream');

var runTimestamp = Math.round(Date.now() / 1000);

gulp.task('iconfont', function () {
    return gulp.src(['icons/*.svg'])
        .pipe(iconfont({
            fontName: 'myfont', // required
            prependUnicode: true, // recommended option
            formats: ['woff'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp, // recommended to get consistent builds when watching files
        }))
        .on('glyphs', function (glyphs, options) {
            // CSS templating, e.g.
            console.log(glyphs, options);
        })
        .pipe(new base64Stream.Base64Encode({ prefix: 'data:font/woff;base64,' }))
        .pipe((gulp.dest('fonts/')));
});
exports.iconfont = gulp.parallel('iconfont');
