#!/usr/bin/env node

//@ts-check
'use strict';
var gulp = require('gulp');
var compressImage = require('../src/compress-image');
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

gulp.task('img', () => compressImage(config,config.src + '/**/*.{png,jpg,jpeg,gif,svg}'));

gulp.task('img')(console.log);