///@ts-check
'use strict';
var gulp = require('gulp');
// var fs = require('fs');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileImage = require('../compiler/compress-image');

var IMAGE_EXTS =['png', 'jpg', 'jpeg', 'svg', 'gif',];

exports.build = function (config) {
    return function () {
        return compileImage(config,extToGlob(config,IMAGE_EXTS));
    };
}

exports.watch = function (config) {
    return function (cb) {
            var glob = extToGlob(config,IMAGE_EXTS);
            return gulp.watch(glob,{})
            .on('change',function(file){return compileImage(config,file);})
            .on('add',function(file){return compileImage(config,file);})
            .on('unlink', unlink(config.src,config.dist));
    }
}