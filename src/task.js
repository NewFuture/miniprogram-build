///@ts-check
'use strict';

var gulp = require('gulp');
var colors = require('ansi-colors');

var taskLog = require('./lib/task-log');

var js = require('./tasks/js');
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
    gulp.series(tasks)(function (err) {
        if (err) {
            console.error(err);
            throw err;
        }
    });
}

gulp.task('js', js.build(exports.$config));
gulp.task('wxss', wxss.build(exports.$config));
gulp.task('wxml', wxml.build(exports.$config));
gulp.task('json', json.build(exports.$config));
gulp.task('image', image.build(exports.$config));
gulp.task('copy', copy.build(exports.$config));
gulp.task('npm', npm.build(exports.$config));

gulp.task('js-watch', js.watch(exports.$config));
gulp.task('wxss-watch', wxss.watch(exports.$config));
gulp.task('wxml-watch', wxml.watch(exports.$config));
gulp.task('json-watch', json.watch(exports.$config));
gulp.task('image-watch', image.watch(exports.$config));
gulp.task('copy-watch', copy.watch(exports.$config));
gulp.task('npm-watch', npm.watch(exports.$config));

gulp.task('clean', clean.build(exports.$config));

//编译项目
gulp.task(
    'compile',
    gulp.parallel('js', 'wxss', 'wxml', 'json', 'image', 'copy', 'npm')
);
// 重新生成文件
gulp.task(
    'build',
    gulp.series(
        taskLog(colors.gray("↓↓↓↓↓↓"), 'compile', colors.blue.underline(exports.$config.src), '→', colors.blue.underline(exports.$config.dist), colors.gray("↓↓↓↓↓↓")),
        'clean',
        'compile',
        taskLog(colors.gray("↑↑↑↑↑↑"), colors.magenta('finished compiling'), colors.gray("↑↑↑↑↑↑")),
    )
);
// 监测文件修改
gulp.task(
    'watch',
    gulp.parallel('js-watch', 'wxss-watch', 'wxml-watch', 'json-watch', 'image-watch', 'copy-watch', 'npm-watch')
);

//开发模式
gulp.task(
    'dev',
    gulp.series(
        'build',
        taskLog(colors.cyanBright('watching for modifying ...')),
        'watch',
    )
);
// gulp.task('defult',gulp.task)
// exports.typescript = exports.js;
// exports.js = js.build(exports.$config);
// exports.wxss = wxss.build(exports.$config);
// exports.wxml = wxml.build(exports.$config);
// exports.json = json.build(exports.$config);
// exports.image = image.build(exports.$config);
// exports.copy = copy.build(exports.$config);
// exports.npm = npm.build(exports.$config);
// clean 任务, dist 目录
// exports.clean = clean.build(exports.$config);

//编译项目
// exports.compile = gulp.parallel(
//     exports.js,
//     exports.wxss,
//     exports.wxml,
//     exports.json,
//     exports.image,
//     exports.copy,
//     exports.npm,
// )

// 重新生成文件
// exports.build = gulp.series(
//     exports.clean,
//     taskLog(colors.gray("↓↓↓↓↓↓"), 'compile', colors.blue.underline(exports.$config.src), '→', colors.blue.underline(exports.$config.dist), colors.gray("↓↓↓↓↓↓")),
//     exports.compile,
//     taskLog(colors.gray("↑↑↑↑↑↑"), colors.magenta('finished compiling'), colors.gray("↑↑↑↑↑↑")),
// );

//监听文件
// exports.watch = gulp.parallel(
//     js.watch(exports.$config),
//     wxss.watch(exports.$config),
//     wxml.watch(exports.$config),
//     json.watch(exports.$config),
//     image.watch(exports.$config),
//     npm.watch(exports.$config),
//     copy.watch(exports.$config),
// )

// exports.dev = gulp.series(
//     exports.build,
//     exports.watch
// );

