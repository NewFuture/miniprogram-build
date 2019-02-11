#!/usr/bin/env node
//@ts-check
'use strict';
var gulp = require('gulp');
var linkNpm = require('../src/compiler/build-npm');
var config = {
    release: false,
    debug: false,
    src: 'src',
    dist: 'dist',
    tsconfig: 'tsconfig.json',
    replace: {
        APPID: 'test_app_id'
    }
}
gulp.task('npm', () => linkNpm(config));

gulp.task('npm')(console.log);