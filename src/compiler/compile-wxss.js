///@ts-check
"use strict";
var path = require("path");
var gulp = require("gulp");
// var sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");

const sass = require("../lib/sass");
const cleanCSS = require("../lib/clean-css");
var inline = require("../lib/inline");
var empty = require("../lib/empty");
var wxssImporter = require("../lib/wxss-importer");
var replace = require("../lib/multi-replace");
var error = require("../log/error");
const debug = require("../log/compile");
const size = require("../log/size");
var TITLE = "wxss:";
/**
 * 编译scss
 * @param {object} config
 * @param {string|string[]} scssFile  编译源
 * @returns {NodeJS.ReadWriteStream}
 */
function compileScss(config, scssFile) {
    // var postCssPlgins = [
    //     // autoprefixer({
    //     //     browsers: [
    //     //         // ios
    //     //         "iOS >= 8",
    //     //         // android
    //     //         "ChromeAndroid >= 53",
    //     //     ],
    //     // }),
    // ];
    // if (config.release) {
    //     postCssPlgins.push(cssnano());
    // }
    return gulp
        .src(scssFile, { base: config.src })
        // .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(
            debug({
                title: TITLE,
                // dist: config.dist,
                distExt: ".wxss",
            }),
        )
        .pipe(
            sass({
                ///@ts-ignore
                importer: wxssImporter,
                // functions: {
                //     'import-wxss($path)': function (path) { return '@import "' + path + '"' }
                // },
                errLogToConsole: true,
                outputStyle: "expanded",
                includePaths: [path.join(config.src, config.assets || "./")],
            }),
        )
        .on("error", error("wxss"))
        // .pipe(
        //     replace(/@import url\(["']?([\w\/\.\-\_]*)["']?\)/g, ($1, $2) => {
        //         return '@import "' + $2 + '"';
        //     }),
        // )
        .pipe(inline(config))
        .pipe(
            cleanCSS({
                sourceMap: false,
                inline: ['none'],
                format: config.release ? "minify" : "beautify",
                level: {
                    1: {
                        all: true,
                        specialComments: config.release ? 0 : "all",
                    },
                    2: {
                        restructureRules: true, // controls rule restructuring;
                    },
                },
                compatibility: {
                    colors: {
                        opacity: true, // controls `rgba()` / `hsla()` color support
                    },
                    properties: {
                        backgroundClipMerging: true, // controls background-clip merging into shorthand
                        backgroundOriginMerging: true, // controls background-origin merging into shorthand
                        backgroundSizeMerging: true, // controls background-size merging into shorthand
                        colors: true, // controls color optimizations
                        ieBangHack: false, // controls keeping IE bang hack
                        ieFilters: false, // controls keeping IE `filter` / `-ms-filter`
                        iePrefixHack: false, // controls keeping IE prefix hack
                        ieSuffixHack: false, // controls keeping IE suffix hack
                        merging: true, // controls property merging based on understandability
                        shorterLengthUnits: false, // controls shortening pixel units into `pc`, `pt`, or `in` units
                        spaceAfterClosingBrace: false, // controls keeping space after closing brace - `url() no-repeat` into `url()no-repeat`
                        urlQuotes: true, // controls keeping quoting inside `url()`
                        zeroUnits: true, // controls removal of units `0` value
                    },
                    selectors: {
                        adjacentSpace: false, // controls extra space before `nav` element
                        ie7Hack: false, // controls removal of IE7 selector hacks, e.g. `*+html...`
                        // mergeablePseudoClasses: [":active"], // controls a whitelist of mergeable pseudo classes
                        // mergeablePseudoElements: ["::after"], // controls a whitelist of mergeable pseudo elements
                        mergeLimit: 8191, // controls maximum number of selectors in a single rule (since 4.1.0)
                        multiplePseudoMerging: true, // controls merging of rules with multiple pseudo classes / elements (since 4.1.0)
                    },
                    units: {
                        ch: false, // controls treating `ch` as a supported unit
                        in: false, // controls treating `in` as a supported unit
                        pc: false, // controls treating `pc` as a supported unit
                        pt: false, // controls treating `pt` as a supported unit
                        rem: true, // controls treating `rem` as a supported unit
                        vh: true, // controls treating `vh` as a supported unit
                        vm: true, // controls treating `vm` as a supported unit
                        vmax: true, // controls treating `vmax` as a supported unit
                        vmin: true, // controls treating `vmin` as a supported unit
                        rpx: true, // controls treating `vmin` as a supported unit
                    },
                },
            }),
        )
        .pipe(
            replace(/@import url\(["']?([\w\/\.\-\_]*)["']?\)/g, ($1, $2) => {
                return '@import "' + $2 + '"';
            }),
        )
        // .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(rename({ extname: ".wxss" }))
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true }));
}

module.exports = compileScss;
