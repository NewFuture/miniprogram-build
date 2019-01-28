//@ts-check
'use strict';
var through = require('through2');
var path = require('path');
var log = require('fancy-log');
var colors = require('ansi-colors');

var TITLE = 'replace:'
// this is how you get the relative path from a vinyl file instance

function getRelativePath(file) {
    return path.relative(path.join(file.cwd, file.base), file.path);
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
        var str = String(file.contents)
        prefix = prefix || '';
        suffix = suffix || '';
        if (file.isBuffer()) {
            if (replacement === undefined) {
                console.assert(typeof opts === 'object', 'replace opts should object')
                for (var key in opts) {
                    var search_key = prefix + key + suffix;
                    var sp = str.split(search_key);
                    if (sp.length > 1) {
                        log(TITLE,
                            colors.green('[' + (sp.length - 1) + ']'),
                            colors.dim.italic(search_key), '==>', colors.cyan.underline(opts[key]),
                            colors.gray('(' + getRelativePath(file) + ')')
                        );
                        str = sp.join(opts[key]);
                    }
                }
            } else if (typeof opts === 'string') {
                var search_key = prefix + opts + suffix;
                var n = str.split(search_key).length - 1;
                if (n > 0) {
                    log(TITLE,
                        colors.green('[' + n + ']'),
                        colors.dim.underline.italic(search_key), '==>',
                        typeof replacement === 'string' ? colors.cyan.underline(replacement) : colors.magenta.italic('Function'),
                        colors.gray('(in ' + getRelativePath(file) + ')')
                    );
                    this.emit('found', search_key, n, getRelativePath(file), replacement);
                    //@ts-ignore
                    str = str.replace(new RegExp(search_key, 'mg'), replacement);
                }
            } else {
                //@ts-ignore
                str = str.replace(opts, replacement);
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