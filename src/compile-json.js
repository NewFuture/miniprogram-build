///@ts-check
'use strict';
var gulp = require('gulp');
var multiReplace = require('./lib/multi-replace');
var jsonmini = require('./lib/json-mini');
var empty = require('./lib/empty');
var debug = require('gulp-debug');
/**
 * 复制 Json文件
 * @param {object} config
 * @param {string|string[]} [jsonFile] 
 */
function replaceJson(config, jsonFile) {
    jsonFile = jsonFile || (config.src + '/**/*.{json,jsonc}');
    var replaceData = {};
    for (var key in (config.replace || {})) {
        replaceData[`{{${key}}}`] = config.replace[key];
    }
    return gulp.src(jsonFile, { base: config.src })
        .pipe(debug({ title: 'json' }))
        .pipe(multiReplace(replaceData))
        .pipe(config.release ? jsonmini() : empty())
        .pipe(gulp.dest(config.dist));
}

module.exports = replaceJson;
