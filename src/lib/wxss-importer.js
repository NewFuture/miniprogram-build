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
        console.log(key, pkg.main, path.join(modulePath, pkg[key || 'main']));
        return path.join(modulePath, pkg[key || 'main']);
    }

    // 无有效字段自动搜索 index|style.[scss|sass|wxss|csss]
    const name = ['index.scss', 'index.sass', /*'index.wxss'*/, 'index.css', 'style.scss', 'style.sass', /*'style.wxss'*/, 'style.css',].find(
        function (name) {
            return fs.existsSync(path.join(modulePath, name));
        }
    )
    if (name) {
        return path.join(modulePath, name);
    }

    // 尝试搜索 bower.json
    const bower = fs.existsSync(path.join(modulePath, 'bower.json')) && npm.loadPackage(modulePath, 'bower.json');
    if (bower) {
        const key = ['sass', 'scss', 'wxss', 'css', 'style'].find(function (key) {
            return typeof bower[key] === "string";
        });
        if (key || (bower.main && !bower.main.endsWith('.js'))) {
            return path.join(modulePath, bower[key || 'main'])
        }
    }
}

/**
 * @param {string} url,
 * @param {string} prev,
 * @param {function} done, 
 */
module.exports = function importer(url, prev, done) {
    // console.log('importer', url)
    if (url[0] === '~' && url[1] !== '/') {
        const npmModule = url.substr(1);
        const n = npmModule.split('/').length;
        if (n === 1 || (n === 2 && npmModule[0] === '@')) {
            // 直接引用包名
            const file = importNpmModule(npmModule);
            if (file) {
                return {
                    file : file,
                }
            }
            // console.log('file', file, fs.readFileSync(file).toString());

        } else {
            return { file: path.join(process.cwd(), 'node_modules', npmModule) }
        }
    } else if (url.startsWith("/") && url.endsWith(".wxss")) {
        return { contents: "@import url(" + url.trim() + ");" }
    } else {
        return null;
    }
};