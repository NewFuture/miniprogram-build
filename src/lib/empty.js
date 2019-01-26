//@ts-check
'use strict';

var through = require("through2");
function empty() {
    return through.obj(function (file, enc, cb) {
        cb(null, file);
    });
}
module.exports = empty;
