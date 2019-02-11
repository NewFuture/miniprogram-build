#!/usr/bin/env node

//@ts-check
'use strict';
var gulp = require('gulp');
var compressWxml = require('../src/compiler/compress-wxml');
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

gulp.task('wxml', () => compressWxml(config, config.src + '/**/*.{wxml,html}'));

gulp.task('wxml')(console.log);