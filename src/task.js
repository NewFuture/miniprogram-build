///@ts-check
'use strict';

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var del = require('del');
var colors = require('ansi-colors');
var log = require('fancy-log');

var compileTs = require('./compile-typescript');
var compileWxss = require('./compile-wxss');
var compileWxml = require('./compress-wxml');
var compileJson = require('./compile-json');
var minifyImage = require('./compress-image');
var copy = require('./copy');
var buildNpm = require('./build-npm');

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
    copy: 'src/**/*.js',
    tsconfig: 'tsconfig.json',
    var: {
    }
}



exports.$config = config;

// clean 任务, dist 目录
exports.clean = gulp.parallel(() => {
    log(colors.blue('clean:'), config.dist);
    return del(config.dist);
});

exports.ts = gulp.parallel(() => compileTs(config, buildSrc(EXT.ts)));
exports.wxss = gulp.parallel(() => compileWxss(config, buildSrc(EXT.wxss)));
exports.wxml = gulp.parallel(() => compileWxml(config, buildSrc(EXT.wxml)));
exports.json = gulp.parallel(() => compileJson(config, buildSrc(EXT.json)));
exports.image = gulp.parallel(() => minifyImage(config, buildSrc(EXT.image)));
exports.copy = gulp.parallel(() => copy(config, config.copy));
exports.npm = gulp.parallel(() => fs.exists('node_modules',
    e => e ? buildNpm(config) : log(colors.red('npm: '), colors.yellowBright('node_modules doesn\'t exist! please run `npm i`')))
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
    exports.compile,
);

//监听文件
exports.watch = () => gulp.watch([config.src], { ignored: /[\/\\]\./ })
    .on('change', function (file) {
        log(colors.yellow(file), 'is changed');
        return fileUpdate(file);
    })
    .on('add', function (file) {
        log(colors.green(file), 'is added');
        return fileUpdate(file);
    })
    .on('unlink', deleteDistFileFormSrc);


exports.dev = gulp.series(
    exports.build,
    exports.watch
);

exports.default = exports.dev;


/**
 * 
 * @param {string[]} exts 
 */
function buildSrc(exts) {
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
        return compileWxss(config, buildSrc(EXT.wxss));
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
