///@ts-check
"use strict";
var gulp = require("gulp");
var debug = require("gulp-debug");
var merge = require("merge-stream");

/**
 * NPM创建 符号链接
 * 文件在windows需要管理员权限，所以package.json 为拷贝
 */
function link(config) {
    return merge(
        gulp
            .src("package.json")
            ///@ts-ignore
            .pipe(debug({ title: "npm-copy:", showCount: false }))
            .pipe(gulp.dest(config.dist)),
        gulp
            .src(["./node_modules"], { resolveSymlinks: false })
            ///@ts-ignore
            .pipe(debug({ title: "npm-link:", showCount: false }))
            .pipe(
                gulp.symlink(config.dist, {
                    ///@ts-ignore
                    useJunctions: false, // windows 是dirmode 防止未识别
                }),
            ),
    );
}
module.exports = link;
