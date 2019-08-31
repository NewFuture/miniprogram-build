
///@ts-check
'use strict';
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var empty = require('../lib/empty');
var replace = require('../lib/multi-replace');
const pkgVar = require('../lib/package-var');
const debug = require("../log/compile");
const size = require('../log/size');
var error = require("../log/error");

var TITLE = 'javascript:';
/**
 * 编译TS
 * @param {object} config * 
 * @param {string|string[]} jsFile
 */
function compilejs(config, jsFile) {
    return gulp.src(jsFile, { base: config.src, sourcemaps: !config.production, ignore: config.exclude })
        .pipe(debug({
            title: TITLE,
            // dist: config.dist,
            distExt: '.js'
        }))
        .pipe(config.production ? empty() : sourcemaps.init())
        .pipe(replace(pkgVar(config.var), undefined, "{{", "}}"))
        .on('error', error(TITLE))
        .pipe(config.production ? empty() : sourcemaps.write())
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true, showTotal: true }))

}
module.exports = compilejs