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

exports.typescript = exports.js;
exports.js = js.build(exports.$config);
exports.wxss = wxss.build(exports.$config);
exports.wxml = wxml.build(exports.$config);
exports.json = json.build(exports.$config);
exports.image = image.build(exports.$config);
exports.copy = copy.build(exports.$config);
exports.npm = npm.build(exports.$config);
// clean 任务, dist 目录
exports.clean = clean.build(exports.$config);

//编译项目
exports.compile = gulp.parallel(
    exports.js,
    exports.wxss,
    exports.wxml,
    exports.json,
    exports.image,
    exports.copy,
    exports.npm,
)

// 重新生成文件
exports.build = gulp.series(
    exports.clean,
    taskLog(colors.gray("↓↓↓↓↓↓"), 'compile', colors.blue.underline(exports.$config.src), '→', colors.blue.underline(exports.$config.dist), colors.gray("↓↓↓↓↓↓")),
    exports.compile,
    taskLog(colors.gray("↑↑↑↑↑↑"), colors.magenta('finished compiling'), colors.gray("↑↑↑↑↑↑")),
);

//监听文件
exports.watch = gulp.parallel(
    js.watch(exports.$config),
    wxss.watch(exports.$config),
    wxml.watch(exports.$config),
    json.watch(exports.$config),
    image.watch(exports.$config),
    npm.watch(exports.$config),
    copy.watch(exports.$config),
)

exports.dev = gulp.series(
    exports.build,
    exports.watch
);