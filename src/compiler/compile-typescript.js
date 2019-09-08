///@ts-check
"use strict";
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
const debug = require("../log/compile");
const size = require('../log/size');
// var empty = require("../lib/empty");
const pkgVar = require('../lib/package-var');
var replace = require("../lib/multi-replace");
// var tsImport = require("../lib/tsimport");
var error = require("../log/error");

var TITLE = "typescript";
/**
 * 编译TS
 * @param {object} config *
 * @param {string|string[]} [tsFile]
 */
function compileTS(config, tsFile) {
    var ts = require("gulp-typescript");
    // var resolver = require("@taqtile/gulp-module-resolver");
    var tsProject = ts.createProject(config.tsconfig, {
        // getCustomTransformers: (program) => ({
        //     before: [require("ts-transform-paths").default()]
        // })
        getCustomTransformers: (program) => require("ts-transform-paths").default()
    });

    var src = tsFile ? gulp.src(tsFile, { base: config.src, sourcemaps: true, ignore: config.exclude }) : tsProject.src();
    //    console.log(tsFile,src)
    return src
        .on("error", error(TITLE))
        .pipe(debug({
            title: TITLE,
            // dist: config.dist,
            distExt: '.js'
        }))
        .pipe(sourcemaps.init())
        .pipe(replace(pkgVar(config.var), undefined, "{{", "}}"))
        .pipe(tsProject(ts.reporter.fullReporter(true)))
        .on("error", error(TITLE))
        .js
        // .pipe(require('gulp-ts-path-alias')(tsProject.config.compilerOptions.baseUrl,tsProject.config.compilerOptions.paths))
        // .pipe(tsProject.options.baseUrl && tsProject.options.paths ? tsImport(tsProject.config.compilerOptions) : empty())
        // .pipe(tsProject.options.baseUrl && tsProject.options.paths ? resolver(tsProject.config.compilerOptions.outDir) : empty())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true }));
}
module.exports = compileTS;
