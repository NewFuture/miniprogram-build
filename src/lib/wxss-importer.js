///@ts-check
'use strict';

var path = require('path');

/**
 * @param {string} url,
 * @param {string} prev,
 * @param {function} done, 
 */
module.exports = function importer(url, prev, done) {
    if (url[0] === '~') {
        return { file: path.join(process.cwd(), 'node_modules', url.substr(1)) }
    } else if (url.startsWith("/") && url.endsWith(".wxss")) {
        return { contents: "@import url(" + url.trim() + ");" }
    } else {
        return null;
    }
};