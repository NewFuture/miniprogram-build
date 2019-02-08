///@ts-check
'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var colors = require('ansi-colors');
var log = require('fancy-log');

var taskLog = require('./lib/task-log')
var compileTs = require('./compiler/compile-typescript');
var compileWxss = require('./compiler/compile-wxss');
var compileWxml = require('./compiler/compress-wxml');
var compileJson = require('./compiler/compile-json');
var minifyImage = require('./compiler/compress-image');
// var copy = require('./compiler/copy');
var buildNpm = require('./compiler/build-npm');

var js = require('./tasks/js');
var wxss = require('./tasks/wxss');
var json = require('./tasks/json');
var wxml = require('./tasks/wxml');
var image = require('./tasks/image');
var npm = require('./tasks/npm');
var copy = require('./tasks/copy');

// var EXT = {
//     ts: ['ts'],
//     wxss: ['scss', 'sass', 'css', 'wxss'],
//     wxml: ['wxml', 'html'],
//     json: ['json', 'jsonc'],
//     image: ['png', 'jpg', 'jpeg', 'svg', 'gif',]
// }

exports.$config = {
    release: false,
    src: 'src',
    dist: 'dist',
    assets:'assets',
    exclude: '',
    copy: '',
    // tsconfig: 'tsconfig.json',
    var: {
    }
}
;

// clean 任务, dist 目录
exports.clean = gulp.parallel(() => {
    log(colors.blue('clean:'), exports.$config.dist);
    return del(exports.$config.dist);
});

exports.js = js.build(exports.$config);
// gulp.parallel(
// js.jsTask(exports.$config)
// );
exports.typescript = exports.js;
exports.wxss = wxss.build(exports.$config);
// gulp.parallel(() => compileWxss(exports.$config, getSrc(EXT.wxss)));
// exports.wxml = gulp.parallel(() => compileWxml(exports.$config, getSrc(EXT.wxml)));
exports.wxml = wxml.build(exports.$config);
exports.json = json.build(exports.$config);
// gulp.parallel(() => compileJson(exports.$config, getSrc(EXT.json)));
exports.image = image.build(exports.$config);
// exports.image = gulp.parallel(() => minifyImage(exports.$config, getSrc(EXT.image)));
exports.copy = copy.build(exports.$config);
// exports.copy = gulp.parallel(() => copy(exports.$config, exports.$config.copy));
exports.npm = npm.build(exports.$config);
// exports.npm = gulp.parallel((cb) =>
//     fs.exists('node_modules',
//         e => (e ? buildNpm(exports.$config) : log(colors.red('npm: '), colors.yellowBright('node_modules/ doesn\'t exist! please run `' + colors.bgRedBright('npm i') + '`'))
//             , cb())
//     )
// );
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
    taskLog(colors.gray("↑↑↑↑↑↑"), colors.magenta('finished compiling'), colors.gray("↑↑↑↑↑↑"))
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

//  (cb) => {
//     gulp.watch([exports.$config.src], { ignored: /[\/\\]\./ })
//         .on('change', function (file) {
//             log(colors.yellow(file), 'is changed');
//             return fileUpdate(file);
//         })
//         .on('add', function (file) {
//             log(colors.green(file), 'is added');
//             return fileUpdate(file);
//         })
//         .on('unlink', deleteDistFileFormSrc);
//     log(colors.cyan('start watching'), colors.blue.underline(exports.$config.src), colors.gray('......'));
//     cb && (cb);
// }


exports.dev = gulp.series(
    exports.build,
    exports.watch
);

exports.default = exports.build;


/**
 * 
 * @param {string[]} exts 
 */
// function getSrc(exts) {
//     if (exts.length === 1) {
//         return exports.$config.src + '/**/*.' + exts[0];
//     } else {
//         return exports.$config.src + '/**/*.{' + exts.join(',') + '}';
//     }
// }

/**
 * 
 * @param {string} filename 
 */
// function getExt(filename) {
//     return path.extname(filename).substr(1).toLowerCase();
// }

/**
 * 
 * @param {string} file 
 */
// function deleteDistFileFormSrc(file) {
//     log(colors.magenta(file), 'is deleted');
//     var distFile = file.replace(exports.$config.src, exports.$config.dist);
//     var extname = getExt(file);
//     for (var key in EXT) {
//         // 删除编译后的文件
//         if (EXT[key].indexof(extname) >= 0) {
//             distFile = distFile.replace(new RegExp(extname + '$'), key);
//             break;
//         }
//     }
//     log(colors.red('delete'), distFile);
//     return del(distFile);
// }

/**
 * 
 * @param {string} file 
 */
// function fileUpdate(file) {
//     var extname = getExt(file);
//     if (EXT.wxss.indexOf(extname) >= 0) {
//         // wxss全部编译
//         return compileWxss(exports.$config, getSrc(EXT.wxss));
//     } else if (EXT.ts.indexOf(extname) >= 0) {
//         return compileTs(exports.$config, file);
//     } else if (EXT.wxml.indexOf(extname) >= 0) {
//         return compileWxml(exports.$config, file);
//     } else if (EXT.json.indexOf(extname) >= 0) {
//         return compileJson(exports.$config, file);
//     } else if (EXT.image.indexOf(extname) >= 0) {
//         return minifyImage(exports.$config, file);
//     } else {
//         return copy(exports.$config, file);
//     }
// };
