///@ts-check
'use strict';
const npm = require('./npm-dependency');
const logger = require('../log/logger');

const REG_VAR = /\{\{package.([\w\d]*?)\}\}/g;

/**
 * 替换变量 {{package.xx}} from `package.json`
 * @param {object} obj 
 */
function replaceVar(obj) {
    try {
        const pkg = npm.loadPackage(process.cwd());
        for (const k in obj) {
            if (obj.hasOwnProperty(k) && typeof obj[k] === "string") {
                obj[k] = obj[k].replace(REG_VAR, (m, key) => pkg[key]);
            }
        }
    } catch (e) {
        logger.warn('package.json load fail:');
        logger.warn(''+e);
    }
    return obj;
}

module.exports = replaceVar