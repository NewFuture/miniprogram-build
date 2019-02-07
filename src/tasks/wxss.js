///@ts-check
'use strict';
var path = require('path');
var gulp = require('gulp');
// var fs = require('fs');
var extToSrc = require('../lib/ext-to-glob');
var compileWxss = require('../compiler/compile-wxss');

var WXSS_EXTS = ['scss', 'sass', 'css', 'wxss'];

function compile(config){
        var glob = extToSrc(config,WXSS_EXTS);
        if(config.assets){
            glob.push('!'+path.join(config.src,config.assets).replace(/\\/g,'/')+'/**/*');
        }
       return compileWxss(config,glob);
}
exports.task = function (config) {
    return function () {
        return compile(config);
    };
}

exports.watch = function (config) {
var update = function (file){
    console.warn(file,JSON.stringify(arguments))
    if(config.assets && file.startsWith(path.join(config.src,config.assets))){
      return  compile(config);//依赖资源文件更改全部编译
    }else{
        return  compileWxss(config,file);
    }
};

    return function (cb) {
            var glob = extToSrc(config,WXSS_EXTS);
            if(config.assets){
                glob.push(path.join(config.src,config.assets).replace(/\\/g,'/')+'/**/*');
            }
            return gulp.watch(glob,{})
            .on('change',update)
            .on('add',update)
            .on('unlink', function(file){
                var distFile = file.replace(config.src, config.dist)
                                    .replace(/\.s?[a|c]ss$/i, '.wxss');;
                // log(colors.red('delete'), distFile);
                return del(distFile); 
            });
    }
}