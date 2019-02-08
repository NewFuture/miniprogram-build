///@ts-check
'use strict';
var del = require('del');

module.exports = function (src,dist,suffix) {
    return function(file){
                // log(colors.red('delete'), distFile);
                var distFile = file.replace(src, dist)
                if(suffix){
                    distFile = distFile.replace(/\.\w*$/, suffix);
                }
                return del(distFile); 
            };
}