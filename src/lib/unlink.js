///@ts-check
'use strict';
var del = require('del');

/**
 * @param {string} src
 * @param {string} dist
 * @param {string} [suffix]
 */
module.exports = function (src,dist,suffix) {
    /**
     * @param {string} file
     */
    return function(file){
                // log(colors.red('delete'), distFile);
                var distFile = file.replace(src, dist)
                if(suffix){
                    distFile = distFile.replace(/\.\w*$/, suffix);
                }
                return del(distFile); 
            };
}