///@ts-check
// Node libs
'use strict';
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var async = require("async");
var colors = require('colors/safe');
var fancyLog = require('fancy-log');

// Cache regex's
var rImages = /([\s\S]*?)(url\(([^)]+)\))(?!\s*[;,]?\s*\/\*\s*base64:skip\s*\*\/)|([\s\S]+)/img;
var rExternal = /^\W*([a-zA-z]+:)?\/\//;
// var rSchemeless = /^\/\//;
var rData = /^\W*data:/;
var rQuotes = /['"]/g;
var rParams = /([?#].*)$/g;

function log(img, file) {
    fancyLog('inline:',
        // path.relative(path.join(file.cwd, file.base), img)
        colors.cyan.underline(path.relative(file.base, img)),
        colors.gray("→"),
        colors.gray('(' + colors.underline(path.relative(file.base, file.path)) + ')'),
    );
}

function isLocalFile(url) {
    return !rExternal.test(url) && !rData.test(url);
}
// Grunt export wrapper
module.exports = (function () {
    "use strict";

    var exports = {};

    /**
     * Takes a CSS file as input, goes through it line by line, and base64
     * encodes any images it finds.
     *
     * @param file Relative or absolute path to a source stylesheet file.
     * @param opts Options object
     * @param done Function to call once encoding has finished.
     */
    exports.stylesheet = function (file, opts, done) {
        opts = opts || {};

        // Cache of already converted images
        var cache = {};

        // Shift args if no options object is specified
        if (typeof opts === "function") {
            done = opts;
            opts = {};
        }

        // var deleteAfterEncoding = opts.deleteAfterEncoding;
        var src = file.contents.toString();
        var result = "";
        var match, img, line, tasks, group;

        async.whilst(function () {
            group = rImages.exec(src);
            return group != null;
        },
            function (complete) {
                // if there is another url to be processed, then:
                //    group[1] will hold everything up to the url declaration
                //    group[2] will hold the complete url declaration (useful if no encoding will take place)
                //    group[3] will hold the contents of the url declaration
                //    group[4] will be undefined
                // if there is no other url to be processed, then group[1-3] will be undefined
                //    group[4] will hold the entire string

                // console.log(group[2]);

                if (group[4] == null) {
                    result += group[1];

                    var rawUrl = group[3].trim();
                    img = rawUrl
                        .replace(rQuotes, "")
                        .replace(rParams, ""); // remove query string/hash parmams in the filename, like foo.png?bar or foo.png#bar

                    var test = true;
                    if (opts.extensions) { //test for extensions if it provided
                        var imgExt = img.split('.').pop();
                        if (typeof opts.extensions === 'function') {
                            test = opts.extensions(imgExt, rawUrl);
                        } else {
                            test = opts.extensions.some(function (ext) {
                                return (ext instanceof RegExp) ? ext.test(rawUrl) : (ext === imgExt);
                            });
                        }
                    }
                    if (test && opts.exclude) { //test for extensions to exclude if it provided
                        if (typeof opts.exclude === 'function') {
                            test = !opts.exclude(rawUrl);
                        } else {
                            test = !opts.exclude.some(function (pattern) {
                                return (pattern instanceof RegExp) ? pattern.test(rawUrl) : (rawUrl.indexOf(pattern) > -1);
                            });
                        }
                    }
                    if (!test) {
                        if (opts.debug) {
                            console.log(img + ' skipped by extension or exclude filters');
                        }
                        result += group[2];
                        return complete();
                    }
                    if (!isLocalFile(rawUrl)) {
                        if (opts.debug) {
                            console.log(img + ' skipped not local file');
                        }
                        result += group[2];
                        return complete();
                    }
                    // see if this img was already processed before...
                    if (cache[img]) {
                        // grunt.log.error("The image " + img + " has already been encoded elsewhere in your stylesheet. I'm going to do it again, but it's going to make your stylesheet a lot larger than it needs to be.");
                        result = result += cache[img];
                        complete();
                    } else {
                        // process it and put it into the cache
                        // var loc = img;
                        //     is_local_file = !rData.test(img) && !rExternal.test(img);

                        // Resolve the image path relative to the CSS file
                        // if (is_local_file) {
                        //     // local file system.. fix up the path
                        //     // loc = path.join(path.dirname(file.path), img);

                        var loc = opts.baseDir ? path.join(opts.baseDir, img) :
                            path.join(path.dirname(file.path), img);

                        // If that didn't work, try finding the image relative to
                        // the current file instead.
                        if (!fs.existsSync(loc)) {
                            // if (opts.debug) {
                            console.error('in ' + loc + ' file doesn\'t exist');
                            // }
                            loc = path.join(file.cwd, img);
                            // return complete(new Error(loc + ' file doesn\'t exist'))
                        }
                        // }

                        // Test for scheme less URLs => "//example.com/image.png"
                        // if (!is_local_file && rSchemeless.test(loc)) {
                        //     loc = 'http:' + loc;
                        // }

                        log(loc, file)
                        exports.image(loc, opts, function (err, resp, cacheable) {
                            if (err == null) {
                                var url = "url(" + resp + ")";
                                result += url;

                                if (cacheable !== false) {
                                    cache[img] = url;
                                }

                                // if (deleteAfterEncoding && is_local_file) {
                                //     if (opts.debug) {
                                //         console.info("Deleting file: " + loc);
                                //     }
                                //     fs.unlinkSync(loc);
                                // }
                            } else {
                                result += group[2];
                            }

                            complete();
                        });
                    }
                } else {
                    result += group[4];
                    complete();
                }
            },
            function () {
                done(null, result);
            });
    };


    /**
     * Takes an image (absolute path or remote) and base64 encodes it.
     *
     * @param img Absolute, resolved path to an image
     * @param opts Options object
     * @return A data URI string (mime type, base64 img, etc.) that a browser can interpret as an image
     */
    exports.image = function (img, opts, done) {

        // Shift args
        if (typeof opts === "function") {
            done = opts;
            opts = {};
        }

        var complete = function (err, encoded, cacheable) {

            // Return the original source if an error occurred
            if (err) {
                // grunt.log.error(err);
                done(err, img, false);

                // Otherwise cache the processed image and return it
            } else {
                done(null, encoded, cacheable);
            }
        };

        // Already base64 encoded?
        if (rData.test(img)) {
            complete(null, img, false);
        } else {
            // Does the image actually exist?
            if (!fs.existsSync(img) || !fs.lstatSync(img).isFile()) {
                // grunt.fail.warn("File " + img + " does not exist");
                if (opts.debug) {
                    console.warn("File " + img + " does not exist");
                }
                complete(true, img, false);
                return;
            }

            // grunt.log.writeln("Encoding file: " + img);
            if (opts.debug) {
                console.info("Encoding file: " + img);
            }

            // Read the file in and convert it.
            var src = fs.readFileSync(img);
            var type = mime.getType(img);
            var encoded = exports.getDataURI(type, src);

            complete(null, encoded, true);
        }
    };


    /**
     * Base64 encodes an image and builds the data URI string
     *
     * @param mimeType Mime type of the image
     * @param img The source image
     * @return Data URI string
     */
    exports.getDataURI = function (mimeType, img) {
        var ret = "data:";
        ret += mimeType;
        if ("image/svg+xml" === mimeType) {
            ret += ";charset=UTF-8,";
            ret += encodeURI(img.toString());
        } else {
            ret += ";base64,";
            ret += img.toString("base64");
        }

        return '\"' + ret + '\"';
    };

    return exports;
})();
