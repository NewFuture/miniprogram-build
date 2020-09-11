
///@ts-check
"use strict";
const warn = require("../log/warn");

const TITLE = 'rollup-plugin';
let PLUGINS = undefined;
/**
 * 加载插件
 * @param {string} [name]
 * @returns {any[]}
 */
module.exports = function loadPlugins(name) {
    if (PLUGINS) {
        return PLUGINS;
    } else {
        PLUGINS = [];
    }
    try {
        const json = require("@rollup/plugin-json");
        PLUGINS.push(json());
    } catch (error) {
        warn(TITLE, name)(error);
    }
    try {
        const replace = require("@rollup/plugin-replace");
        // @ts-ignore
        PLUGINS.push(replace({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development',
            )
        }));
    } catch (error) {
        try {
            const replace = require("@rollup/plugin-replace");
            // @ts-ignore
            PLUGINS.push(replace({
                'process.env.NODE_ENV': JSON.stringify(
                    process.env.NODE_ENV || 'development',
                )
            }));
        } catch (error) {
            warn(TITLE, name)(error);
        }
    }
    try {
        const rollupNodeResolve = require("@rollup/plugin-node-resolve");
        PLUGINS.push(
            //@ts-ignore
            rollupNodeResolve.nodeResolve ({
                // modulesOnly: true,
            }),
        );
    } catch (error) {
        warn(TITLE, name)(error);
    }
    try {
        const rollupCommonjs = require("@rollup/plugin-commonjs");
        PLUGINS.push(
            //@ts-ignore
            rollupCommonjs({}),
        );
    } catch (error) {
        warn(TITLE, name)(error);
    }

    return PLUGINS;
}
