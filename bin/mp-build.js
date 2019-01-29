#!/usr/bin/env node

///@ts-check
'use strict';
var argv = require('yargs').argv;
var tasks = require('../src/task');
var loadConfig = require('../src/load-config');

var config = loadConfig(argv['config']);
Object.assign(tasks.$config, config);

for (var key in argv) {
    if (key !== '_' && key !== '$0' && key !== 'config') {
        tasks.$config[key] = argv[key]
    }
}

if (argv._.length === 0) {
    tasks.default(() => { });
} else {
    argv._.forEach(task => {
        tasks[task]();
    });
}