//@ts-check
'use strict';
var through = require('through2');

/**
 * 
 * @param {object|string|RegExp} opts 
 * @param {string|Function} [replacement] 
 */
function multiReplace(opts, replacement) {
    function replace(file, encoding, callback) {
        // var self = this;
        var str = String(file.contents)
        if (file.isBuffer()) {
            if (replacement === undefined) {
                console.assert(typeof opts === 'object', 'opts should object')
                for (var key in opts) {
                    str = str.split(key).join(opts[key]);
                }
            } else {
                //@ts-ignore
                str = str.replace(opts, replacement);
            }
            file.contents = new Buffer(str);
        } else if (file.isStream()) {
            console.error('Streaming not supported')
            this.emit('error', 'font64：Streaming not supported');
            return callback('Streaming not supported', file);
        }
        callback(null, file);
    }

    return through.obj(replace);
};
module.exports = multiReplace;