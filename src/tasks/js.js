///@ts-check
'use strict';
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var compileTs = require('../compiler/compile-typescript');
var compileJs = require('../compiler/compile-javascript');

exports.jsTask = function (config) {
    return function () {
        // 自动判断TS/JS
        if (config.tsconfig || fs.existsSync('tsconfig.json')) {
            config.tsconfig = config.tsconfig || 'tsconfig.json';
            return compileTs(config);
        } else {
            return compileJs(config, config.src + '/**/*.js');
        }
    }
}

/**
 */
function update(config,file){
    return path.extname(file).toLowerCase()==='.ts'? compileTs(config,file):compileJs(config,file);
}

exports.watch = function (config) {
    return function (cb) {
            return gulp.watch([config.src+'/**/*.{ts,js}'],{
                ignored:config.src+'/*/**.d.ts',
            }).on('change',function(file){
              return update(config,file);
            }).on('add',function(file){
              return  update(config,file);
            }).on('unlink', function(file){
                var distFile = file.replace(config.src, config.dist)
                                    .replace(/\.ts$/i, '.js');;
                // log(colors.red('delete'), distFile);
                return del(distFile); 
            });
            // cb && cb();
    }
}
