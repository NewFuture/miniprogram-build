///@ts-check
"use strict";
import path from 'path';

import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import builtins from 'builtin-modules';

const external = [path.resolve(__dirname, '../package.json')];

export default {
    // 核心选项
    input: ['src/common.js'],     // 必须
    external: (id, parent, isResolved) => {
        if (builtins.includes(id)) {
            return true
        } else if (external.includes(id)) {
            return true
        } else if (parent && external.includes(path.resolve(path.dirname(parent), id))) {
            return true
        }

        // console.log(id, parent, parent&&path.resolve(parent, id))
        return false;
    },
    plugins: [
        // builtins({'fs':true}),

        nodeResolve({
            'browser': false,
            'preferBuiltins': true
        }),
        commonjs(),
        json()
    ],
    output: {  // 必须 (如果要输出多个，可以是一个数组)
        // 核心选项
        file: "dist/common.js",    // 必须
        format: 'cjs',  // 必须
        interop: false,
        //   name,
        //   globals,

        // 额外选项
        // paths,
        // banner: "#!/usr/bin/env node",
    },
};
