///@ts-check
'use strict';

const path = require('path');
const fs = require('fs');
const npm = require('./npm-dependency');

/**
 * 加载npm 默认导出 scss/css 样式
 * @param {string} moduleName 
 * @returns {string|null}
 */
function importNpmModule(moduleName) {
    // 直接引用包名
    const modulePath = path.join(process.cwd(), 'node_modules', moduleName);

    // 自动提取 sass/wxss/style 字段
    const pkg = npm.loadPackage(modulePath);
    const key = [
        'sass',
        'scss',
        //  'wxss', 
        'style'
    ].find(function (key) {
        return typeof pkg[key] === "string";
    });
    if (key || (pkg.main && !pkg.main.endsWith('.js'))) {
        // console.log(key, pkg.main, path.join(modulePath, pkg[key || 'main']));
        return path.join(modulePath, pkg[key || 'main']);
    }

    // 无有效字段自动搜索 index|style.[scss|sass|wxss|csss]
    const name = [
        'index.scss', 'index.sass', 'index.wxss', 'index.css',
        'style.scss', 'style.sass', 'style.wxss', 'style.css',
    ].find(name => fs.existsSync(path.join(modulePath, name)));
    if (name) {
        return path.join(modulePath, name);
    }

    // 尝试搜索 bower.json
    const bower = fs.existsSync(path.join(modulePath, 'bower.json')) && npm.loadPackage(modulePath, 'bower.json');
    if (bower) {
        const key = ['sass', 'scss', 'wxss', 'css', 'style'].find(key => typeof bower[key] === "string");
        if (key || (bower.main && !bower.main.endsWith('.js'))) {
            return path.join(modulePath, bower[key || 'main'])
        }
    }
}

/**
 * 自动创建scss文件
 * @param {string} file 
 */
function syncFile(file) {
    // console.log(file);
    if (
        !['.css', '.scss', '.sass'].includes(path.extname(file)) &&
        !fs.existsSync(file + '.scss') &&
        !fs.existsSync(file + '.css') &&
        !fs.existsSync(file + '.sass')
    ) {
        fs.copyFileSync(file, file + '.scss');
    }
    return file;

}

/**
 * @param {string} url,
 * @param {string} prev,
 * @param {function} done, 
 */
module.exports = function importer(url, prev, done) {
    // console.log('import', url, prev);
    if (url[0] === '~' && url[1] !== '/') {
        // import from node_modules
        const npmModule = url.substr(1);
        const n = npmModule.split('/').length;
        if (n === 1 || (n === 2 && npmModule[0] === '@')) {
            // 直接引用包名
            const file = importNpmModule(npmModule);
            if (file) {
                return {
                    file: syncFile(file),
                }
            }
        } else {
            const file = path.join(process.cwd(), 'node_modules', npmModule);
            return { file: syncFile(file) }
        }
    } else if (prev && prev.indexOf('node_modules') >= 0) {
        // inner import of node_modules
        // 引用的 node_modules 再次引用其他文件
        const file = path.resolve(path.dirname(prev), url);
        return { file: syncFile(file) }
    } else if (url.endsWith(".wxss") && !fs.existsSync(url + '.scss') && !fs.existsSync(url + '.css') && !fs.existsSync(url + '.sass')) {
        // 引用本地wxss 并保持不变
        // keep import 
        // console.log(url);
        // dart-sass not support

        return { contents: '@import url(' + url.trim() + ');' };
    } else {
        return null;
    }
};