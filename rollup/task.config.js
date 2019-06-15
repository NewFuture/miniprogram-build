///@ts-check
"use strict";
import path from 'path';

import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import builtins from 'builtin-modules';

const external = [
    path.resolve(__dirname, '../package.json'),
    path.resolve(__dirname, '../src/common.js'),

    "gulp",
    "gulp-better-rollup",
    // "gulp-rename",
    "gulp-sourcemaps",
    "gulp-typescript",
    // "imagemin",
    // "mime",
    // "rimraf",
    "through2",
    // "ts-transform-paths",

    "sass",
    "typescript",

    "rollup-plugin-commonjs",
    "rollup-pluginutils",

    "imagemin-gifsicle",
    "imagemin-jpegtran",
    "imagemin-optipng",
    "imagemin-svgo",
];
export default {
    // 核心选项
    input: ['src/task.js'],     // 必须
    external: (id, parent, isResolved) => {
        if (builtins.includes(id)) {
            // return true
        } else if (external.includes(id)) {
            // return true
        } else if (parent) {
            const p = path.resolve(path.dirname(parent), id);
            if (external.includes(p)) {
                id = p;
            } else if (external.includes(p + '.js')) {
                id = p + '.js';
            } else {
                id = '';
            }
        } else {
            id = ''
        }
        if (id) {
            return { id, external: true }
        }
        return false;
    },
    plugins: [
        nodeResolve({
            dedupe: [
                "file-type",
                'chokidar',

                "through2",
                "rimraf",
                'gulp-rename',
                'tslib',
                ...external
            ],

        }),
        commonjs({
            'ignore': [
                path.resolve('./src/common.js'),
            ],
        }),
        json()
    ],
    output: {  // 必须 (如果要输出多个，可以是一个数组)
        // 核心选项
        file: "dist/task.js",    // 必须
        format: 'cjs',  // 必须
        interop: false,

        //   name,
        //   globals,
    },
};