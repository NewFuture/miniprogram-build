///@ts-check
'use strict';

var gulp = require('gulp');
var colors = require('colors/safe');
var path = require('path');

var taskLog = require('./log/task-log');
var error = require('./log/error');


var typescript = require('./tasks/typescript');
var javascript = require('./tasks/javascript');

var wxss = require('./tasks/wxss');
var json = require('./tasks/json');
var wxml = require('./tasks/wxml');
var image = require('./tasks/image');
var npm = require('./tasks/npm');
var copy = require('./tasks/copy');
var clean = require('./tasks/clean');

exports.$config = {
    release: false,
    src: 'src',
    dist: 'dist',
    assets: 'assets',
    exclude: '',
    copy: '',
    tsconfig: 'tsconfig.json',
    var: {
    }
};
exports.$gulp = gulp;
/**
 * @param {string[]} tasks
 */
exports.$execute = function (tasks) {
    exports.$config.src = path.normalize(exports.$config.src);
    exports.$config.dist = path.normalize(exports.$config.dist);
    gulp.series(tasks)(function (err) {
        if (err) {
            console.error(JSON.stringify(err));
            throw err;
        }
    });
}
gulp.task('typescript', typescript.build(exports.$config));
gulp.task('javascript', javascript.build(exports.$config));
gulp.task('js', gulp.parallel('typescript', 'javascript'));
gulp.task('wxss', wxss.build(exports.$config));
gulp.task('wxml', wxml.build(exports.$config));
gulp.task('json', json.build(exports.$config));
gulp.task('image', image.build(exports.$config));
gulp.task('copy', copy.build(exports.$config));
gulp.task('npm', npm.build(exports.$config));

gulp.task('typescript-watch', typescript.watch(exports.$config));
gulp.task('javascript-watch', javascript.watch(exports.$config));
gulp.task('js-watch', gulp.parallel('typescript-watch', 'javascript-watch'));
gulp.task('wxss-watch', wxss.watch(exports.$config));
gulp.task('wxml-watch', wxml.watch(exports.$config));
gulp.task('json-watch', json.watch(exports.$config));
gulp.task('image-watch', image.watch(exports.$config));
gulp.task('copy-watch', copy.watch(exports.$config));
gulp.task('npm-watch', npm.watch(exports.$config));

gulp.task('clean', clean.build(exports.$config));

//编译项目
gulp.task('compile', gulp.series(
    taskLog(colors.rainbow("↓↓↓↓↓↓"), colors.blue('compiling ' + colors.underline(exports.$config.src) + ' → ' + colors.underline(exports.$config.dist)), colors.rainbow("↓↓↓↓↓↓")),
    gulp.parallel('js', 'wxss', 'wxml', 'json', 'image', 'copy', 'npm'),
    taskLog(colors.rainbow("↑↑↑↑↑↑"), colors.green('√ finished compiling'), colors.rainbow("↑↑↑↑↑↑"))
))
// 重新生成文件
gulp.task('build', gulp.series('clean', 'compile'));
// 监测文件修改
gulp.task('watch', gulp.series(
    gulp.parallel('js-watch', 'wxss-watch', 'wxml-watch', 'json-watch', 'image-watch', 'copy-watch', 'npm-watch'),
    taskLog(colors.rainbow('All watching tasks started ...')))
);

//开发模式
gulp.task('dev', gulp.series('build', 'watch'));

gulp.on('error', error('gulp'));
