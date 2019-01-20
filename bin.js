#!/usr/bin/env node

///@ts-check
'use strict';

var tasks = require('./gulpfile');
var argv = require('yargs').argv;
// var gulp = require('gulp');


if (argv['config']) {
    var configFile = '' + argv['config'];
    if (!configFile.startsWith('.') && !configFile.startsWith('/')) {
        configFile = './' + configFile;
    }
    Object.assign(tasks.config, require(configFile))
}
if (argv['debug']) {
    tasks.config.debug = true;
}
if (argv['release']) {
    tasks.config.release = true;
}

if (argv._.length === 0) {
    tasks.default(() => { });
} else {
    argv._.forEach(task => {
        tasks[task]();
    });
}