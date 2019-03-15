///@ts-check
"use strict";
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
const debug = require("../log/compile");
const size = require('../log/size');
var empty = require("../lib/empty");
var replace = require("../lib/multi-replace");
const loadPlugins = require("../lib/rollup-plugins");
var error = require("../log/error");
const warn = require("../log/warn");
const npm = require('../lib/npm-dependency');

const wxtsConfig = {
    include: ["**/*.wxts", "**/*.ts"],
    target: "es5",
    module: "ES6",
    downlevelIteration: true,//Provide full support for iterables in for..of, spread and destructuring when targeting ES5 or ES3.
    isolatedModules: true,//Transpile each file as a separate module (similar to “ts.transpileModule”).
    noLib: true,
    lib: ['es5']
}

const defaultConfig =
{
    // allowJs: true,
    // checkJs: true,
    alwaysStrict: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    // noUnusedLocals: true,
    // noUnusedParameters: true,
    // strictBindCallApply: true,
    // strictFunctionTypes: true,
    // strictPropertyInitialization: true,
    strictNullChecks: true,
}
var TITLE = "wxts:";
/**
 * 编译TS
 * @param {object} config *
 * @param {string|string[]} tsFile
 * @param {any} tsconfig 
 */
function compileWxts(config, tsFile, tsconfig) {
    var ts = require("rollup-plugin-typescript");
    const gulpRollup = require("gulp-better-rollup");
    const dependencies = Object.keys(npm.getDependencies(process.cwd()));
    var newConfig = Object.assign({}, defaultConfig, tsconfig ? tsconfig.compilerOptions : {}, wxtsConfig);
    const plugins = [ts(newConfig)].concat(loadPlugins());
    return gulp.src(tsFile, { base: config.src, sourcemaps: !config.release })
        .pipe(debug({
            title: TITLE,
            // dist: config.dist,
            distExt: '.wxs'
        }))
        .pipe(config.release ? empty() : sourcemaps.init())
        .pipe(gulpRollup(
            {
                // rollup: require('rollup'),
                onwarn: warn(TITLE),
                treeshake: { propertyReadSideEffects: false },
                external: (m) => m.endsWith(".wxs") && !dependencies.includes(m.split('/')[0])
                , plugins: plugins,
                // globals:{wx:'wx'}
            },
            {
                format: "cjs",
                esModule: false,
            }
        ))
        .on("error", error(TITLE))
        .pipe(rename({ extname: ".wxs" }))
        .pipe(replace(config.var, undefined, "{{", "}}"))
        .pipe(config.release ? empty() : sourcemaps.write())
        .pipe(gulp.dest(config.dist))
        .pipe(size({ title: TITLE, showFiles: true }));
}
module.exports = compileWxts;
