///@ts-check
"use strict";
var path = require("path");
var gulp = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var debug = require("gulp-debug");
var cssnano = require("cssnano");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var size = require("gulp-size");
var inline = require("../lib/inline");
var empty = require("../lib/empty");
var wxssImporter = require("../lib/wxss-importer");
var replace = require("../lib/multi-replace");
var error = require("../log/error");

var TITLE = "wxss:";
/**
 * 编译scss
 * @param {object} config
 * @param {string|string[]} scssFile  编译源
 * @returns {NodeJS.ReadWriteStream}
 */
function compileScss(config, scssFile) {
    var postCssPlgins = [
        autoprefixer({
            browsers: [
                // ios
                "iOS >= 8",
                // android
                "ChromeAndroid >= 53",
            ],
        }),
    ];
    if (config.release) {
        postCssPlgins.push(cssnano());
    }
    return gulp
        .src(scssFile, { base: config.src })
        .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(debug({ title: TITLE }))
        .pipe(
            sass({
                ///@ts-ignore
                importer: wxssImporter,
                errLogToConsole: true,
                outputStyle: "expanded",
                includePaths: [path.join(config.src, config.assets || "./"), "node_modules"],
            }),
        )
        .on("error", error("wxss"))
        .pipe(
            replace(/@import url\(["']?([\w\/\.\-\_]*)["']?\)/g, ($1, $2) => {
                return '@import "' + $2 + '"';
            }),
        )
        .pipe(inline())
        .pipe(postcss(postCssPlgins))
        .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(rename({ extname: ".wxss" }))
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true }));
}

module.exports = compileScss;
