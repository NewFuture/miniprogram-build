#!/usr/bin/env node

//@ts-check

// var path = require('path');
'use strict';
var gulp = require('gulp');
var compileTS = require('./src/compile-ts');
var config = {
    release: false,
    debug: false,
    src: 'src',
    dist: 'dist',
    tsconfig: 'tsconfig.json',
    replace: {
    }
}

gulp.task('ts', () => compileTS(config));
gulp.task('ts')(console.log);