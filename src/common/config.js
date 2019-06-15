
///@ts-check
"use strict";
import fs from 'fs';

import colors from "ansi-colors";
import json5 from 'json5';

import * as pkg from '../../package.json';
import logger from './logger';
// const fs = require('fs');

const TITLE = colors.gray('config:');
const DEFAULT_CONFIG_FILES = [
    'mpconfig.json',
    'mpconfig.jsonc',
    '.mpconfig.json',
    '.mpconfig.jsonc',
]

const CACHE = {}
const config = {
    // debug: true,
    release: false,
    src: 'src',
    dist: 'dist',
    assets: 'assets',
    exclude: [],
    copy: '',
    tsconfig: '',
    var: {
    }
};

/**
 * 读取配置
 * @param {string|any} configFile
 */
function loadConfig(configFile) {
    if (CACHE[configFile]) {
        return CACHE[configFile];
    }
    if (configFile) {
        if (!fs.existsSync(configFile)) {
            logger.error(TITLE, colors.red.underline(configFile), colors.bgRed('does not exist'));
            throw new Error(configFile + 'does not exist');
        }
    }
    try {
        const json = fs.readFileSync(configFile, 'utf-8');
        let config = json5.parse(json);
        const version = pkg.version;
        logger.info(TITLE, colors.cyan.italic(`v${version}`), 'load config', colors.blue.underline(configFile))
        const allowedKeys = Object.keys(config);

        config = Object.keys(config)
            .filter(key => allowedKeys.indexOf(key) >= 0)
            .reduce((obj, key) => { obj[key] = config[key]; return obj }, {})
        CACHE[configFile] = config;
        return config;
    } catch (ex) {
        logger.error(TITLE, colors.red.underline(configFile), 'failed to load.', colors.red(ex));
        // process.exit(1);
        throw ex;
    }
}

/**
 * 自动读取配置 
 */
function autoLoadConfig() {
    // try load default configure file
    for (let index = 0; index < DEFAULT_CONFIG_FILES.length; index++) {
        if (fs.existsSync(DEFAULT_CONFIG_FILES[index])) {
            return loadConfig(DEFAULT_CONFIG_FILES[index]);
        }
    }
    return {}
};
/**
 * 生成配置文件
 * @param {object} conf 
 * @param {string} [file] 默认 '.mpconfig.jsonc'
 */
function saveConfig(conf, file) {
    file = file || '.mpconfig.jsonc';
    if (fs.existsSync(file)) {
        logger.error(TITLE, colors.red('file (' + file + ') already exists!'), 'Please delete it to regenerate.')
        logger.error(TITLE, colors.red('配置文件 (' + file + ') 已存在!'), '可删除后重新生成。')
    } else {
        conf.$schema = 'https://miniprogram-build.newfuture.cc/config.schema.json';
        const str = JSON.stringify(conf, undefined, 4);
        fs.writeFileSync(file, str);
        logger.info(TITLE, colors.green('file `' + file + '` is generated!'))
        logger.info(TITLE, colors.green('配置文件 `' + file + '` 已生成!'))
    }
}

export default {
    loadConfig,
    saveConfig,
    autoLoadConfig
}

export { config as defaultConfig };