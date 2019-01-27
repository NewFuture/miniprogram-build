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
var compileScss = require('../src/compile-scss');
gulp.task('scss', () => compileScss(config.src + '/**/*.{scss,sass,css}', config));

gulp.task('scss')(console.log);