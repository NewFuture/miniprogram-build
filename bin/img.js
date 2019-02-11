#!/usr/bin/env node

//@ts-check
'use strict';
var gulp = require('gulp');
var compressImage = require('../src/compiler/compress-image');
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

gulp.task('img', () => compressImage(config.src + '/**/*.{png,jpg,jpeg,gif,svg}', config.src, config.dist));

gulp.task('img')(console.log);