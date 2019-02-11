#!/usr/bin/env node

//@ts-check

// var path = require('path');
'use strict';
var gulp = require('gulp');
var config = {
    release: false,
    debug: false,
    src: 'src',
    dist: 'dist',
    tsconfig: 'tsconfig.json',
    replace: {
    }
}
var compileScss = require('../src/compiler/compile-wxss');
gulp.task('scss', () => compileScss(config, config.src + '/**/*.{scss,sass,css}'));

gulp.task('scss')(console.log);