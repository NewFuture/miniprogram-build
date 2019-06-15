///@ts-check
'use strict';
// var del = require('del');

// /**
//  * @param {string} src
//  * @param {string} dist
//  * @param {string} [suffix]
//  */
// module.exports = function (src,dist,suffix) {
//     /**
//      * @param {string} file
//      */
//     return function(file){
//                 // log(colors.red('delete'), distFile);
//                 var distFile = file.replace(src, dist)
//                 if(suffix){
//                     distFile = distFile.replace(/\.\w*$/, suffix);
//                 }
//                 return del(distFile); 
//             };
// }

const rm = require('rimraf');
const colors = require('../common').colors;
// var path = require('path');
const log = require('../common').logger;
module.exports = function (src, dist, suffix) {
    /**
     * @param {string} file
     */
    return function (file) {
        var distFile = file.replace(src, dist)
        if (suffix) {
            distFile = distFile.replace(/\.\w*$/, suffix);
        }
        // return del(distFile); 
        rm(distFile, {maxBusyTries: 5,}, function(err){
            if(!err){
                log(colors.red.dim('deleted:'), distFile);
            }else{
                log.error(colors.redBright('fail to delete'), distFile,err);
            }
        })
    };
}