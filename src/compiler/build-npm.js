///@ts-check
"use strict";

const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const gulpRename = require("gulp-rename");

// const gulpRollup = require("gulp-better-rollup");
const npm = require("../lib/npm-dependency");
const loadPlugins = require("../lib/rollup-plugins");
const error = require("../log/error");
const warn = require("../log/warn");
const debug = require("../log/compile");
const size = require("../log/size");

const TITLE = "npm:";

/**
 * 组件component
 * @param {string} dependencyName 
 * @param {string} mpDistPath 
 * @param {string} destName 
 */
function createMpTask(dependencyName, mpDistPath, destName) {
    return () => {
        return gulp
            .src(path.join(mpDistPath, "**/*"))
            .pipe(
                debug({
                    title: TITLE,
                    srcName: `<${dependencyName}(component)>`,
                    dist: path.join("miniprogram_npm", dependencyName) + path.sep,
                    // distName: destName
                    // once: true,
                }),
            )
            .pipe(gulp.dest(destName))
            .on("error", error(`${TITLE} <${dependencyName}(component)>`))
            .pipe(
                size({
                    title: TITLE,
                    sub: `${dependencyName}(component)`,
                    showFiles: false,
                    showTotal: true,
                }),
            );
    };
}

/**
 * 普通NPM依赖 rollup
 * @param {string} dependencyName 
 * @param {string} entryFilePath 
 * @param {string} destName 
 * @param {string[]} dependencyNames 
 */
function createNpmTask(dependencyName, entryFilePath, destName, dependencyNames) {
    const gulpRollup = require("gulp-better-rollup");
    const rollup = require("rollup");
    if (!fs.existsSync(entryFilePath)) {
        warn(TITLE)(`can't resolve ${entryFilePath}`);
        return (cb) => {
            cb();
        }
    }
    return () =>
        gulp
            .src(entryFilePath)
            .pipe(
                debug({
                    title: TITLE,
                    srcName: `<${dependencyName}>`,
                    dist: path.join("miniprogram_npm", dependencyName),
                    // distName: destName
                }),
            )
            .pipe(
                gulpRollup(
                    {
                        rollup: rollup,
                        onwarn: warn(TITLE, dependencyName),
                        external: dependencyNames,
                        plugins: loadPlugins(),
                    },
                    {
                        format: "es",
                        esModule: false,
                    }
                ),
            )
            .on("error", error(`${TITLE} <${dependencyName}>`))
            .pipe(
                gulpRename({
                    basename: "index",
                    extname: ".js",
                }),
            )
            .pipe(gulp.dest(destName))
            .pipe(size({ title: TITLE, sub: dependencyName, showFiles: false, showTotal: true }));
}

module.exports =
    /**
     *
     * @param {string} cwd
     * @param {string} distPath
     * @param {string[]} baseDependencies
     */
    function buildNpm(cwd, distPath, baseDependencies) {
        const mp_npm = npm.getMp_NpmDependencies(baseDependencies, cwd, cwd);
        const mpDependencies = mp_npm[0];
        const npmDependencies = mp_npm[1];
        const mpTask = Object.keys(mpDependencies).reduce((result, depName) => {
            const mpDistPath = mpDependencies[depName];
            const dest = path.join(distPath, "miniprogram_npm", depName);
            result.push(createMpTask(depName, mpDistPath, dest));
            return result
        }, []);

        const dependencyNames = Object.keys(npmDependencies);
        const npmTasks = dependencyNames.reduce((result, dependencyName) => {
            const entryFilePath = npmDependencies[dependencyName];
            const dest = path.join(distPath, "miniprogram_npm", dependencyName);
            result.push(createNpmTask(dependencyName, entryFilePath, dest, dependencyNames));
            return result;
        }, []);
        return gulp.parallel(mpTask.concat(npmTasks));
    };
