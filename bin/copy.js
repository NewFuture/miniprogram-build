#!/usr/bin/env node

//@ts-check
'use strict';
var gulp = require('gulp');
var copy = require('../src/copy');
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

gulp.task('copy', () => copy(config, config.src + '/**/*.js'));

gulp.task('copy')(console.log);