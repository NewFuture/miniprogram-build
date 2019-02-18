///@ts-check
"use strict";
var gulp = require("gulp");
var path = require("path");
var debug = require("gulp-debug");
// var exec = require("gulp-exec");
var error = require("../log/error");

// var exec = require("child_process").exec;
// var merge = require("merge-stream");
// var npmDist = require("../lib/npm-dist");
var npmInstall = require("../lib/npm-install");
/**
 * NPM创建 符号链接
 * 文件在windows需要管理员权限，所以package.json 为拷贝
 */
function link(config) {
    // return (
    //     gulp
    //         .src("package.json")
    //         ///@ts-ignore
    //         .pipe(debug({ title: "npm:", showCount: false }))
    //         .pipe(
    //             exec("ls", {
    //                 cwd: config.dist,
    //                 continueOnError: false, // default = false, true means don't emit error event
    //                 pipeStdout: false, // default = false, true means stdout is written to file.contents
    //             }),
    //         )
    //         .pipe(
    //             exec.reporter({
    //                 err: true, // default = true, false means don't write err
    //                 stderr: true, // default = true, false means don't write stderr
    //                 stdout: true, // default = true, false means don't write stdout
    //             }),
    //         )
    //         .pipe(gulp.dest(config.dist))
    //         .on("error", error("npm:"))
    // );
    // return  exec("ls", {
    //     cwd: config.dist,
    //     continueOnError: false, // default = false, true means don't emit error event
    //     pipeStdout: false, // default = false, true means stdout is written to file.contents
    // }, function (err, stdout, stderr) {
    //     console.log(stdout);
    //     console.log(stderr);
    //     cb(err);
    //   }),
    // return mergeStream(
    //     gulp
    //         .src("package.json")
    //         ///@ts-ignore
    //         .pipe(debug({ title: "npm-copy:", showCount: false }))
    //         .pipe(gulp.dest(config.dist)),
    //     gulp
    //         .src(["./node_modules"], { resolveSymlinks: false })
    //         ///@ts-ignore
    //         .pipe(debug({ title: "npm-link:", showCount: false }))
    //         .pipe(
    //             gulp.symlink(config.dist, {
    //                 ///@ts-ignore
    //                 useJunctions: false, // windows 是dirmode 防止未识别
    //             }),
    //         ),
    // );
    // console.log(npmDist(),path.join(config.dist, "miniprogram_npm"))
    // return         gulp
    //         .src(npmDist(), { base: "node_modules" })
    //         ///@ts-ignore
    //         .pipe(debug({ title: "npm-copy:", showCount: false }))
    //         .pipe(gulp.dest(path.join(config.dist),{
    //         }))
    // ;

    return gulp
        .src("package.json")
        ///@ts-ignore
        .pipe(debug({ title: "npm:", showCount: false }))
        .pipe(gulp.dest(config.dist), false)
        .pipe(npmInstall({ cwd: path.join(process.cwd(), config.dist) }), false)
        .on("error", error("npm:"))
        .pipe(gulp.dest(config.dist), true)
        ;
}
module.exports = link;
