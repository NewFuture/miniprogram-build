///@ts-check
"use strict";

const PluginError = require('plugin-error');
const through = require('through2');
const chalk = require('ansi-colors');
const prettyBytes = require('../lib/pretty-bytes');
const StreamCounter = require('../lib/byte-counter');
const titleColor = require('./color');
const fancyLog = require('./logger');



module.exports = opts => {
    opts = Object.assign({
        pretty: true,
        showTotal: true
    }, opts);

    let totalSize = 0;
    let fileCount = 0;

    function log(sym, what, size) {
        let title = opts.title;
        title = title ? titleColor(title) : '';
        if (opts.sub) {
            sym += chalk.cyanBright(`<${chalk.bold.underline(opts.sub)}>`);
        }
        size = opts.pretty ? prettyBytes(size) : (size + ' B');
        fancyLog(title, sym, what, chalk.gray('(') + chalk.magentaBright(size) + chalk.gray(')'));
    }

    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        const finish = (err, size) => {
            if (err) {
                cb(new PluginError('size', err));
                return;
            }

            totalSize += size;

            if (opts.showFiles === true && size > 0) {
                log(
                    chalk.reset.whiteBright('[√]'),
                    chalk.green.underline.bold(opts.showTotal ? chalk.dim(file.relative) : file.relative),
                    size);
            }

            fileCount++;
            cb(null, file);
        };

        if (file.isStream()) {

            file.contents.pipe(new StreamCounter())
                .on('error', finish)
                .on('finish', function () {
                    finish(null, this.bytes);
                });


            return;
        }


        finish(null, file.contents.length);

    }, function (cb) {
        // @ts-ignore
        this.size = totalSize;
        // @ts-ignore        
        this.prettySize = prettyBytes(totalSize);

        if (!(fileCount === 1 && opts.showFiles) && totalSize > 0 && fileCount > 0 && opts.showTotal) {
            log(chalk.reset.bold.greenBright.italic('√'), chalk.green('All ' + fileCount + (fileCount > 1 ? ' files' : ' file') + ' done!'), totalSize);
        }
        cb();
    });
};