#!/usr/bin/env node

///@ts-check
'use strict';

var tasks = require('../src/task');
var argv = require('yargs').argv;
var fs = require('fs');
var minify = require('node-json-minify');

if (argv['config']) {
    var configFile = '' + argv['config'];
    if (!configFile.startsWith('.') && !configFile.startsWith('/')) {
        configFile = './' + configFile;
    }
    if (!fs.existsSync(configFile)) {
        console.error(configFile, 'configure file not found!');
    } else {
        var json = fs.readFileSync(configFile, 'utf-8');
        var config = JSON.parse(minify(json));
        Object.assign(tasks.$config, config);
    }
}

for (var key in argv) {
    if (key !== '_' && key !== '$0' && key !== 'config') {
        tasks.$config[key] = argv[key]
    }
}
// if (argv['debug']) {
//     tasks.$config.debug = true;
// }
// if (argv['release']) {
//     tasks.$config.release = true;
// }

// if(argv['init']){
//     // init
// }else

if (argv._.length === 0) {
    tasks.default(() => { });
} else {
    argv._.forEach(task => {
        tasks[task]();
    });
}