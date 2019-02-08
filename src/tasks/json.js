///@ts-check
'use strict';
var gulp = require('gulp');
// var fs = require('fs');
var extToGlob = require('../lib/ext-to-glob');
var unlink = require('../lib/unlink');
var compileJson = require('../compiler/compile-json');

var JSON_EXTS = ['json', 'jsonc', 'cjson'];

function compile(config){
        var glob = extToGlob(config,JSON_EXTS);
        // if(config.assets){
        //     glob.push('!'+path.join(config.src,config.assets).replace(/\\/g,'/')+'/**/*');
        // }
       return compileJson(config,glob);
}
exports.build = function (config) {
    return function () {
        return compile(config);
    };
}

exports.watch = function (config) {
    return function (cb) {
            var glob = extToGlob(config,JSON_EXTS);
            return gulp.watch(glob,{})
            .on('change',function(file){return compileJson(config,file);})
            .on('add',function(file){return compileJson(config,file);})
            .on('unlink', unlink(config.src,config.dist,'.json'))
            ;
    }
}