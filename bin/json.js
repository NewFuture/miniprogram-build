#!/usr/bin/env node
//@ts-check
'use strict';
var gulp = require('gulp');
var compileJson = require('../src/compiler/compile-json');
var config = {
    release: false,
    debug: false,
    src: 'src',
    dist: 'dist',
    tsconfig: 'tsconfig.json',
    replace: {
        APPID:'test_app_id'
    }
}
gulp.task('json', () => compileJson(config));

gulp.task('json')(console.log);