///@ts-check
"use strict";

const through = require('through2');
const chalk = require('ansi-colors');
const PluginError = require('../lib/error');
const prettyBytes = require('../lib/pretty-bytes');
const prettyTime = require('../lib/pretty-time');

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
    const time = process.hrtime();

    function log(sym, what, size, duration, highlightSize) {
        let title = opts.title;
        title = title ? titleColor(title) : '';
        if (opts.sub) {
            sym += chalk.cyanBright(` <${chalk.bold.underline(opts.sub)}>`);
        }
        size = opts.pretty ? prettyBytes(size) : (size + ' B');
        duration = duration ? chalk.gray("[" + prettyTime(duration) + "]") : '';
        fancyLog(title , sym , what, chalk.gray('(') + chalk[highlightSize ? 'magentaBright' : 'gray'](size) + chalk.gray(')') + duration);
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
                    chalk.reset.whiteBright.dim(chalk.symbols.check),
                    chalk.green.underline.bold(opts.showTotal ? chalk.dim(file.relative) : file.relative),
                    size,
                    !opts.showTotal);
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
            const diff = process.hrtime(time);
            const duration = diff[0] * 1e9 + diff[1]
            log(chalk.reset.bold.greenBright.italic(chalk.symbols.check), chalk.green('All ' + fileCount + (fileCount > 1 ? ' files' : ' file') + ' done!'), totalSize, duration, true);
        }
        cb();
    });
};