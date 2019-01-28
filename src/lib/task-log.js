var log = require('fancy-log');

module.exports = function () {
    var arg = arguments;
    return function (cb) {
        log.apply(log, arg);
        cb && cb();
    }
}
