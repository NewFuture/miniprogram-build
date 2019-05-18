///@ts-check
'use strict';
// 加载配置

var fs = require('fs');
// var minify = require('node-json-minify');
var colors = require('ansi-colors');
var json5 = require('json5');

var log = require('./log/logger');

var TITLE = colors.gray('config:');

var DEFAULT_CONFIG_FILES = [
    'mpconfig.json',
    'mpconfig.jsonc',
    '.mpconfig.json',
    '.mpconfig.jsonc',
]

const CACHE = {}

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
            log.error(TITLE, colors.red.underline(configFile), colors.bgRed('does not exist'));
            throw new Error(configFile + 'does not exist');
        }
    }
    try {
        var json = fs.readFileSync(configFile, 'utf-8');
        var config = json5.parse(json);
        log.info(TITLE, colors.cyan.italic(`v${require('../package.json').version}`), 'load config', colors.blue.underline(configFile))
        CACHE[configFile] = config;
        return config;
    } catch (ex) {
        log.error(TITLE, colors.red.underline(configFile), 'failed to load.', colors.red(ex));
        // process.exit(1);
        throw ex;
    }
}

module.exports.load = loadConfig;

module.exports.default = function () {
    // try load default configure file
    for (var index = 0; index < DEFAULT_CONFIG_FILES.length; index++) {
        if (fs.existsSync(DEFAULT_CONFIG_FILES[index])) {
            return loadConfig(DEFAULT_CONFIG_FILES[index]);
        }
    }
    return {}
}