///@ts-check
'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
const debug = require("../log/compile");
const size = require('../log/size');
var err = require('../log/error');
var multiReplace = require('../lib/multi-replace');
const pkgVar = require('../lib/package-var');
var jsonMini = require('../lib/json-mini');

var TITLE = 'json';
/**
 * 复制 Json文件
 * @param {object} config
 * @param {string|string[]} [jsonFile] 
 */
function replaceJson(config, jsonFile) {
    jsonFile = jsonFile || (config.src + '/**/*.{json,jsonc}');
    return gulp
        .src(jsonFile, { base: config.src, ignore: config.exclude })
        .pipe(debug({
            title: TITLE,
            dist: config.dist,
            distExt: '.json'
        }))
        .pipe(rename({ 'extname': '.json' }))
        .pipe(jsonMini(!config.production))
        .on('error', err(TITLE))
        .pipe(multiReplace(pkgVar(config.var), undefined, '{{', '}}'))
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true, showTotal: true }))
        ;
}

module.exports = replaceJson;
