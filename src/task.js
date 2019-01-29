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
var copy = require('./compiler/copy');
var buildNpm = require('./compiler/build-npm');

var js = require('./tasks/js');

var EXT = {
    ts: ['ts'],
    wxss: ['scss', 'sass', 'css', 'wxss'],
    wxml: ['wxml', 'html'],
    json: ['json', 'jsonc'],
    image: ['png', 'jpg', 'jpeg', 'svg', 'gif',]
}
var config = {
    release: false,
    debug: false,
    src: 'src',
    dist: 'dist',
    exclude: '',
    copy: '',
    // tsconfig: 'tsconfig.json',
    var: {
    }
}

exports.$config = config;

// clean 任务, dist 目录
exports.clean = gulp.parallel(() => {
    log(colors.blue('clean:'), config.dist);
    return del(config.dist);
});

exports.ts = js.jsTask(config);
// gulp.parallel(
// js.jsTask(config)
// );
exports.typescript = exports.ts;
exports.wxss = gulp.parallel(() => compileWxss(config, getSrc(EXT.wxss)));
exports.wxml = gulp.parallel(() => compileWxml(config, getSrc(EXT.wxml)));
exports.json = gulp.parallel(() => compileJson(config, getSrc(EXT.json)));
exports.image = gulp.parallel(() => minifyImage(config, getSrc(EXT.image)));
exports.copy = gulp.parallel(() => copy(config, config.copy));
exports.npm = gulp.parallel((cb) =>
    fs.exists('node_modules',
        e => (e ? buildNpm(config) : log(colors.red('npm: '), colors.yellowBright('node_modules/ doesn\'t exist! please run `' + colors.bgRedBright('npm i') + '`'))
            , cb())
    )

);
//编译项目
exports.compile = gulp.parallel(
    exports.ts,
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
    taskLog(colors.gray("↓↓↓↓↓↓"), 'compile', colors.blue.underline(config.src), '→', colors.blue.underline(config.dist), colors.gray("↓↓↓↓↓↓")),
    exports.compile,
    taskLog(colors.gray("↑↑↑↑↑↑"), colors.magenta('finished compiling'), colors.gray("↑↑↑↑↑↑"))
);

//监听文件
exports.watch = (cb) => {
    gulp.watch([config.src], { ignored: /[\/\\]\./ })
        .on('change', function (file) {
            log(colors.yellow(file), 'is changed');
            return fileUpdate(file);
        })
        .on('add', function (file) {
            log(colors.green(file), 'is added');
            return fileUpdate(file);
        })
        .on('unlink', deleteDistFileFormSrc);
    log(colors.cyan('start watching'), colors.blue.underline(config.src), colors.gray('......'));
    cb && (cb);
}


exports.dev = gulp.series(
    exports.build,
    exports.watch
);

exports.default = exports.build;


/**
 * 
 * @param {string[]} exts 
 */
function getSrc(exts) {
    if (exts.length === 1) {
        return config.src + '/**/*.' + exts[0];
    } else {
        return config.src + '/**/*.{' + exts.join(',') + '}';
    }
}

/**
 * 
 * @param {string} filename 
 */
function getExt(filename) {
    return path.extname(filename).substr(1).toLowerCase();
}

/**
 * 
 * @param {string} file 
 */
function deleteDistFileFormSrc(file) {
    log(colors.magenta(file), 'is deleted');
    var distFile = file.replace(config.src, config.dist);
    var extname = getExt(file);
    for (var key in EXT) {
        // 删除编译后的文件
        if (EXT[key].indexof(extname) >= 0) {
            distFile = distFile.replace(new RegExp(extname + '$'), key);
            break;
        }
    }
    log(colors.red('delete'), distFile);
    return del(distFile);
}

/**
 * 
 * @param {string} file 
 */
function fileUpdate(file) {
    var extname = getExt(file);
    if (EXT.wxss.indexOf(extname) >= 0) {
        // wxss全部编译
        return compileWxss(config, getSrc(EXT.wxss));
    } else if (EXT.ts.indexOf(extname) >= 0) {
        return compileTs(config, file);
    } else if (EXT.wxml.indexOf(extname) >= 0) {
        return compileWxml(config, file);
    } else if (EXT.json.indexOf(extname) >= 0) {
        return compileJson(config, file);
    } else if (EXT.image.indexOf(extname) >= 0) {
        return minifyImage(config, file);
    } else {
        return copy(config, file);
    }
};
