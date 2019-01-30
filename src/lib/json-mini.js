///@ts-check
'use strict';

var through2 = require('through2');
var json5 = require('json5');

/**
 * 
 * @param {string} json 
 * @param {boolean} pretty 
 */
function mini(json, pretty) {
    var data = json5.parse(json);
    return JSON.stringify(data, undefined, pretty ? 4 : 0);
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