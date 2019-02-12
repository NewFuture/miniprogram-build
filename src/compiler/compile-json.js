///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var size = require('gulp-size');
var err = require('../log/error');
var multiReplace = require('../lib/multi-replace');
var jsonMini = require('../lib/json-mini');

var TITLE = 'json:';
/**
 * 复制 Json文件
 * @param {object} config
 * @param {string|string[]} [jsonFile] 
 */
function replaceJson(config, jsonFile) {
    jsonFile = jsonFile || (config.src + '/**/*.{json,jsonc}');
    return gulp.src(jsonFile, { base: config.src })
        .pipe(debug({ title: TITLE }))
        .pipe(rename({ 'extname': '.json' }))
        .pipe(jsonMini(!config.release))
        .on('error', err(TITLE))
        .pipe(multiReplace(config.var, undefined, '{{', '}}'))
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist))
        ;
}

module.exports = replaceJson;
