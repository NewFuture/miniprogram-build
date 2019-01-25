'use strict';
var through = require('through2');

module.exports = function (config) {
    config = Object.assign({ fontName: 'iconfont', 'type': 'woff' }, config)
    // create a stream through which each file will pass
    return through.obj(function (file, enc, callback) {

        if (file.isNull()) {
            this.push(file);
            // do nothing if no contents
            return callback();
        }

        if (file.isStream()) {
            console.error('Streaming not supported')
            this.emit('error', 'font64：Streaming not supported');
            return callback();
        }

        if (file.isBuffer()) {
            var file64 = new Buffer(file.contents).toString('base64');
            var csswrapper = '@font-face {font-family: ' + config.fontName + '; src: url(data:' + config.type + ';base64,' + file64 + ');}';
            var output = csswrapper;

            file.contents = new Buffer(output);
            file.path = gutil.replaceExtension(file.path, '.css');
            return callback(null, file);
        }
    });
}; 
