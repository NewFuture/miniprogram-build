///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var debug = require('gulp-debug');
var size = require('gulp-size');
var log = require('fancy-log');
var colors = require('ansi-colors');
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
        .pipe(rename({ 'extname': '.json' }))
        .pipe(jsonMini(!config.release))
        .on('error', function (err) {
            log.error(TITLE, colors.red(err.name), '\n', colors.red.underline(err.message));
            this.emit('end');
        })
        .pipe(multiReplace(config.var, undefined, '{{', '}}'))
        .pipe(size({ title: TITLE, showFiles: true }))
        .pipe(gulp.dest(config.dist));
}

module.exports = replaceJson;
