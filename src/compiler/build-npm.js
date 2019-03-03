///@ts-check
'use strict';

const fs = require('fs')
const path = require('path')

const gulp = require('gulp');
// const gulpPlumber = require('gulp-plumber')
// const rollup = require('rollup')
// const gulpBabel = require('gulp-babel')

const gulpRollup = require('gulp-better-rollup');
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const rollupCommonjs = require('rollup-plugin-commonjs')
const gulpRename = require('gulp-rename')
const error = require("../log/error");
const debug = require("../log/compile");
const size = require('../log/size');

const TITLE = 'npm:'
/**
 * 
 * @param {string} cwd 
 * @param {string} [modulePath] 
 */
function resolveDependencies(cwd, modulePath) {
    modulePath = modulePath || cwd
    const packageConfig = require(path.resolve(modulePath, 'package.json'))
    const dependencyNames = packageConfig.dependencies ? Object.keys(packageConfig.dependencies) : []

    return dependencyNames.reduce((dependencies, dependencyName) => {
        const modulePath = path.resolve(cwd, 'node_modules', dependencyName)
        return Object.assign(dependencies, {
            [dependencyName]: modulePath
        }, resolveDependencies(cwd, modulePath))
    }, {})
}

/**
 * 
 * @param {string} cwd 
 */
function getMiniprogramDistPath(cwd) {
    const packageConfig = require(path.resolve(cwd, 'package.json'))
    return path.resolve(cwd, packageConfig.miniprogram || 'miniprogram_dist')
}

module.exports =
    /**
     * 
     * @param {string} cwd 
     * @param {string} distPath 
     * @param {object} [extraDependencies] 
     */
    function buildNpm(cwd, distPath, extraDependencies) {
        const dependencies = Object.assign(resolveDependencies(cwd), extraDependencies)
        const dependencyNames = Object.keys(dependencies)
        const npmTasks = dependencyNames.reduce((result, dependencyName) => {
            const modulePath = dependencies[dependencyName]
            if (!fs.existsSync(modulePath)) {
                return result
            }

            const mpDistPath = getMiniprogramDistPath(modulePath)
            const destName = path.join(distPath, 'miniprogram_npm', dependencyName);
            if (mpDistPath && fs.existsSync(mpDistPath)) {
                const task = () => {
                    return gulp.src(path.join(mpDistPath, '**/*'))
                        .pipe(debug({
                            title: TITLE,
                            srcName: `[${dependencyName}]`,
                            distName: path.join('miniprogram_npm', dependencyName) + path.sep,
                            // distName: destName
                        }))
                        .pipe(gulp.dest(destName))
                        .on('error', error(`${TITLE}[${dependencyNames}]`))
                        .pipe(size({ title: TITLE, sub: `[${dependencyName}]`, showFiles: true, showTotal: true }))
                }
                result.push(task)
            } else {
                const dependencyConfig = require(path.resolve(modulePath, 'package.json'))
                const entryFilePath = require.resolve(path.resolve(modulePath, dependencyConfig.module || dependencyConfig.main || 'index.js'))
                if (fs.existsSync(entryFilePath)) {
                    const task = () => gulp.src(entryFilePath)
                        // .pipe(gulpPlumber())
                        .pipe(debug({
                            title: TITLE,
                            srcName: `[${dependencyName}]`,
                            dist: path.join('miniprogram_npm', dependencyName),
                            // distName: destName
                        }))
                        .pipe(gulpRollup({
                            // rollup: rollup,
                            external: dependencyNames,
                            plugins: [
                                rollupNodeResolve({
                                    modulesOnly: true
                                }),
                                rollupCommonjs({})
                            ]
                        }, {
                                format: 'cjs',
                                esModule: false
                            })
                        )
                        .on('error', error(`${TITLE}[${dependencyNames}]`))
                        .pipe(gulpRename({
                            basename: 'index',
                            extname: '.js'
                        }))
                        .pipe(gulp.dest(destName))
                        .pipe(size({ title: TITLE, sub: `[${dependencyName}]`, showFiles: false, showTotal: true }))

                    // .on('finish', () => console.log(`finish compiling ${dependencyName} package files.`))

                    result.push(task)
                }
            }
            return result
        }, [])
        return gulp.parallel(npmTasks)
    }
