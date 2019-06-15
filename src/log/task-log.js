///@ts-check
'use strict';
var log = require('../common').logger;


module.exports = function () {
    var arg = arguments;
    return function (cb) {
        log.apply(log, arg);
        cb && cb();
    }
}
