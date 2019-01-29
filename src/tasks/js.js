///@ts-check
'use strict';
// var gulp = require('gulp');
var fs = require('fs');
var compileTs = require('../compiler/compile-typescript');
var compileJs = require('../compiler/compile-javascript');

exports.jsTask = function (config) {
    return function () {
        // 自动判断TS/JS
        if (config.tsconfig || fs.existsSync('tsconfig.json')) {
            config.tsconfig = config.tsconfig || 'tsconfig.json';
            return compileTs(config);
        } else {
            return compileJs(config, config.src + '/**/*.js');
        }
    }
}
// exports.jsWatch = function (config) {
//     return function (cb) {
//         return gulp.watch()
//     }
// }