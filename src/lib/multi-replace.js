//@ts-check
'use strict';
var through = require('through2');
var path = require('path');
var log = require('fancy-log');
var colors = require('ansi-colors');

var TITLE = 'replace:'

/**
 * 
 * @param {number} n 
 * @param {string} key 
 * @param {*} value 
 * @param {object} file 
 */
function logReplace(n, key, value, file) {
    log.info(
        TITLE,
        n > 1 ? colors.green(n + '*') : '',
        colors.blue.italic(key),
        colors.dim('→'),
        typeof value === 'function' ? colors.magenta.italic('Function') : colors.cyan.underline(value),
        colors.gray('(' + colors.underline(
            path.relative(file.base, file.path)
        ) + ')'),
    )
}

/**
 * 批量替换字符串
 * @param {object|string|RegExp} opts 
 * @param {string|Function} [replacement] 
 * @param {string} [prefix] 
 * @param {string} [suffix] 
 */
function multiReplace(opts, replacement, prefix, suffix) {
    function replace(file, encoding, callback) {
        var str = file.contents.toString();
        prefix = prefix || '';
        suffix = suffix || '';
        if (file.isBuffer()) {
            if (replacement === undefined) {
                console.assert(typeof opts === 'object', 'replace opts should object')
                for (var key in opts) {
                    var search_key = prefix + key + suffix;
                    var sp = str.split(search_key);
                    if (sp.length > 1) {
                        str = sp.join(opts[key]);
                        logReplace(sp.length - 1, search_key, opts[key], file);
                    }
                }
            } else if (typeof opts === 'function') {
                /**
                 * @type {number}
                 */
                var n = (str.match(opts) || []).length||0;
                if (n > 0) {
                    str = str.replace(opts, replacement);
                    logReplace(n, search_key, replacement, file);
                }
            } else {
                var search_key = prefix + opts + suffix;
                var n = str.split(search_key).length - 1;
                if (n > 0) {
                    //@ts-ignore
                    str = str.replace(new RegExp(search_key, 'mg'), replacement);
                    logReplace(n, search_key, replacement, file);
                }

            }
            file.contents = new Buffer(str);
        } else if (file.isStream()) {
            console.error('Streaming not supported')
            this.emit('error', 'replace：Streaming not supported');
            return callback('Streaming not supported', file);
        }
        callback(null, file);
    }

    return through.obj(replace);
};
module.exports = multiReplace;