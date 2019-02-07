
/**
 * @param {object} config
 * @param {string[]} exts 
 */
module.exports=function(config,exts) {
    var glob=[];
    if (exts.length === 1) {
        glob=[ config.src + '/**/*.' + exts[0]];
    } else {
        glob =[ config.src + '/**/*.{' + exts.join(',') + '}'];
    }

    if(config.exclude){
        if(config.exclude instanceof Array){
            glob=glob.concat(config.exclude);
        }else{
            glob.push(config.exclude);
        }
    }
    return glob;
}
