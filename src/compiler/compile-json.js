///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
const debug = require("../log/compile");
const size = require('../log/size');
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
        .pipe(debug({
            title: TITLE, 
            // dist: config.dist,
            distExt: '.json'
        }))
        .pipe(rename({ 'extname': '.json' }))
        .pipe(jsonMini(!config.release))
        .on('error', err(TITLE))
        .pipe(multiReplace(config.var, undefined, '{{', '}}'))
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true, showTotal: false }))
        ;
}

module.exports = replaceJson;
