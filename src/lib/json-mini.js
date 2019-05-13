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
        var err = null;
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isBuffer()) {
            try {
                file.contents = Buffer.from(mini(file.contents.toString(), pretty));
            } catch (error) {
                err = error
                err.fileName = file.path;
            }
        }
        if (file.isStream()) {
            file.contents = file.contents.pipe(through2.obj((json, enc, cb) => {
                try {
                    cb(null, mini(json.toString(), pretty));
                } catch (error) {
                    error.fileName = file.path;
                    cb(error);
                }
            }));
        }
        cb(err, file);
    });
}
module.exports = jsonMinify;