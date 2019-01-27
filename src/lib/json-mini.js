//@ts-check
'use strict';
var through = require("through2");
var PluginError = require('plugin-error');
module.exports = function () {
    'use strict';

    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('json-mini', 'Streaming not supported'));
            return callback();
        }

        try {
            file.contents = new Buffer(JSON.stringify(JSON.parse(file.contents.toString())));
        } catch (err) {
            this.emit('error', new PluginError('json-mini', err));
        }

        this.push(file);
        callback();
    });
};