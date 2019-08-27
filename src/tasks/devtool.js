
const path = require('path');
const devtool = require('wechat-devtool');
const colors = require('ansi-colors');


const logger = require('../log/logger');
const config = require('../config').default;

const RAW_TITLE = 'devtool:';
const TITLE = require('../log/color')(RAW_TITLE);
const errLog = require('../log/error')(RAW_TITLE);

exports.open = function () {
    logger.info(TITLE, 'opening project ' + colors.underline.gray(config.dist))
    return devtool.cli('--open', path.resolve(config.dist))
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: '开发工具打开项目出错', message: res.stderr.trim() });
            } else {
                logger.info(TITLE, '[√] 已经打开项目' + config.dist)
            }
        });
}

exports.close = function () {
    logger.info(TITLE, 'closing project' + colors.underline.gray(config.dist))
    return devtool.cli('--close', path.resolve(config.dist))
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: '微信开发工具关闭项目出错', message: res.stderr.trim() });
            } else {
                return new Promise(resolve => setTimeout(resolve, 3000));
            }
        }).then(function (res) {
            logger.info(TITLE, '[√] 已经关闭项目 ' + config.dist);
            return res;
        });
}

exports.quit = function () {
    logger.info(TITLE, 'quit...')
    return devtool.cli('--quit', path.resolve(config.dist))
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: '微信开发工具调用出错', message: res.stderr.trim() });
            } else {
                return new Promise(resolve => setTimeout(resolve, 3000));
            }
        }).then(function (res) {
            logger.info(TITLE, '[√] 已经退出微信开发工具');
            return res;
        });
}

exports.upload = function () {
    logger.info(TITLE, 'uploading project')
}

// gulp.task('close', () => devtool.cli('--close', $config.dist).then(() => new Promise(resolve => setTimeout(resolve, 3000))));
// gulp.task('quit', () => devtool.cli('--quit').then(() => new Promise(resolve => setTimeout(resolve, 3000))));
// gulp.task('upload',)