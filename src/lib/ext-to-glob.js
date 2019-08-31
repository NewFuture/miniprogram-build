///@ts-check
'use strict';

var path = require('path');

/**
 *
 * @param {string} glob
 */
function wrapExclude(glob) {
    return glob && /!/.test(glob) ? glob : '!' + glob;
}
/**
 * @param {object} config
 * @param {string[]|string} exts
 * @param {boolean} [includeAssets]
 */
module.exports = function (config, exts, includeAssets) {
    var glob = [];
    if (typeof exts === 'string') {
        glob = [exts];
    } else if (exts.length === 1) {
        glob = [config.src + '/**/*.' + exts[0]];
    } else {
        glob = [config.src + '/**/*.{' + exts.join(',') + '}'];
    }

    if (config.exclude) {
        if (config.exclude instanceof Array) {
            glob = glob.concat(config.exclude.map(wrapExclude));
        } else {
            glob.push(wrapExclude(config.exclude));
        }
    }

    if (config.assets) {
        var a = path.join(config.src, config.assets).replace(/\\/g, '/') + '/**/*';
        glob.push(includeAssets ? a : '!' + a);
    }
    return glob.filter(v => v);
}
