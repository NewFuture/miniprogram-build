///@ts-check
"use strict";
import path from 'path';

import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import builtins from 'builtin-modules';

const external = [
    path.resolve(__dirname, '../package.json'),
    path.resolve(__dirname, '../src/task.js'),
    path.resolve(__dirname, '../src/common.js'),
];

export default {
    // 核心选项
    input: ['src/cli.js'],     // 必须
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
        }),
        commonjs({
            'sourceMap': false,
            exclude: [
                path.resolve('./src/common.js'),
                './src/common.js',
                path.resolve('./src/task.js'),
                './src/task.js'
            ]
        }),
        json()
    ],
    output: {  // 必须 (如果要输出多个，可以是一个数组)
        // 核心选项
        file: "dist/cli.js",    // 必须
        format: 'cjs',  // 必须
        //   name,
        //   globals,
        interop: false,
        // 额外选项
        // paths:{
        //     // './common':path.resolve('./src/common.js')
        // },
        banner: "#!/usr/bin/env node",
    },
};