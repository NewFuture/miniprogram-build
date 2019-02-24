//@ts-check
"use strict";
var through = require("through2");
var exec = require("child_process").exec;

module.exports = function (opts) {
    function install(file, encoding, callback) {
        exec("npm install --production --no-package-lock --no-bin-links --ignore-scripts --no-audit", opts, function (err, stdout, stderr) {
            // console.log(stdout);
            console.error(stderr);
            callback(err);
        });
    }

    return through.obj(install);
};
