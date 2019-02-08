///@ts-check
'use strict';
var gulp = require('gulp');
// var fs = require('fs');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileWxml = require('../compiler/compress-wxml');

var WXML_EXTS = ['wxml', 'html'];

exports.build = function (config) {
    return function () {
        var glob = extToGlob(config,WXML_EXTS);
        return compileWxml(config,glob);
    };
}

exports.watch = function (config) {
    return function (cb) {
            var glob = extToGlob(config,WXML_EXTS);
            return gulp.watch(glob,{})
            .on('change',function(file){return compileWxml(config,file);})
            .on('add',function(file){return compileWxml(config,file);})
            .on('unlink', unlink(config.src,config.dist,'.wxml'));
    }
}