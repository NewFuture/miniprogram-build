///@ts-check
"use strict";

const path = require('path');
const through = require('through2');
// const stringifyObject = require('stringify-object');
const chalk = require('ansi-colors');
const titleColor = require('./color');
const fancyLog = require('./logger');

const inputStyle = chalk.cyanBright.bold.underline;
function outputStyle(str) {
    if (str) {
        return chalk.gray(" → ") + chalk.underline.italic(str);
    }
    return '';
}

const home = require('os').homedir();

function tildify(str) {
    str = path.normalize(str) + path.sep;
    return (str.indexOf(home) === 0 ? str.replace(home + path.sep, '~' + path.sep) : str).slice(0, -1);
};

module.exports = options => {
    options = Object.assign({
        logger: fancyLog,
        title: 'mp-build:',
        minimal: true,
        showFiles: true,
        showCount: false
    }, options);

    if (process.argv.includes('--verbose')) {
        options.verbose = true;
        options.minimal = false;
        options.showFiles = true;
        options.showCount = true;
    }

    let count = 0;

    return through.obj((file, enc, cb) => {
        if (options.showFiles) {
            let output = chalk.whiteBright('► ');
            const name = path.relative(file.base, file.path);
            if (options.minimal) {
                output += inputStyle(options.srcName || name);
            } else {
                output =
                    '\n' +
                    (file.cwd ? 'cwd:   ' + inputStyle(tildify(file.cwd)) : '') +
                    (file.base ? '\nbase:  ' + inputStyle(tildify(file.base)) : '') +
                    (file.path ? '\npath:  ' + inputStyle(tildify(file.path)) : '') +
                    // (file.stat && options.verbose ? '\nstat:  ' + prop(stringifyObject(file.stat, { indent: '       ' }).replace(/[{}]/g, '').trim()) : '') +
                    '\n';
            }

            // let outPath = ''
            if (options.distName) {
                output += outputStyle(options.distName);
            } else if (options.distExt || options.dist) {
                output += outputStyle(
                    path.join(
                        options.dist || '',
                        name.replace(/\.(.*)$/, options.distExt || '.$1')
                    )
                );
            }

            options.logger(titleColor(options.title), output, chalk.bold.gray('...'));
        }

        count++;
        cb(null, file);
    }, cb => {
        if (options.showCount) {
            options.logger(titleColor(options.title), chalk.green(count + ' ' + (count > 0 ? 'items' : 'item')));
        }
        cb();
    });
};
