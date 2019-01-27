///@ts-check
'use strict';

var through2 = require('through2');
var minify = require('node-json-minify');

/**
 * 
 * @param {string} json 
 * @param {boolean} pretty 
 */
function mini(json, pretty) {
    var data = minify(json);
    return pretty ? JSON.stringify(JSON.parse(data), undefined, 4) : data;
}

/**
 * 
 * @param {boolean} [pretty] - 格式化输出
 */
function jsonMinify(pretty) {
    return through2.obj((file, enc, cb) => {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isBuffer()) {
            file.contents = new Buffer(mini(file.contents.toString(), pretty));
        }
        if (file.isStream()) {
            file.contents = file.contents.pipe(through2.obj((json, enc, cb) => {
                cb(null, mini(json.toString(), pretty));
            }));
        }
        cb(null, file);
    });
}
module.exports = jsonMinify;