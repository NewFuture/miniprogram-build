#!/usr/bin/env node

//@ts-check
'use strict';
var gulp = require('gulp');
var copy = require('../src/compiler/copy');
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

gulp.task('copy', () => copy(config.dist, config.src + '/**/*.js', config.src));

gulp.task('copy')(console.log);