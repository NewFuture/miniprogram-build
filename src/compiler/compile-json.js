///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var size = require('gulp-size');
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
    // var replaceData = {};
    // for (var key in (config.replace || {})) {
    //     replaceData[`{{${key}}}`] = config.replace[key];
    // }
    return gulp.src(jsonFile, { base: config.src })
        .pipe(debug({ title: TITLE }))
        .pipe(multiReplace(config.var, undefined, '{{', '}}'))
        .pipe(jsonMini(!config.release))
        .pipe(rename({ 'extname': '.json' }))
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist));
}

module.exports = replaceJson;
