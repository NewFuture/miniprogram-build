
///@ts-check
"use strict";
const path = require('path');
const os = require('os');
const fs = require('fs');

const devtool = require('wechat-devtool');
const colors = require('ansi-colors');

const logger = require('../log/logger');
const config = require('../config').default;

const RAW_TITLE = 'devtool:';
const TITLE = require('../log/color')(RAW_TITLE);
const errLog = require('../log/error')(RAW_TITLE);

const startIcon = colors.whiteBright('[►]');
const successIcon = colors.green.bold('√');

/**
 * 打开项目
 */
exports.open = function () {
    logger.info(TITLE, startIcon, colors.cyan('open'), 'project in', colors.underline(config.dist))
    return devtool.cli('--open', path.resolve(config.dist))
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: '开发工具打开项目出错', message: res.stderr.trim() });
            } else {
                logger.info(TITLE, colors.green('√ 已经使用微信开发工具自动打开此项目'));
                logger.info(TITLE, colors.gray(' 可切换至开发工具窗口进行调试 :)'));
            }
        });
}

/**
 * 关闭项目
 */
exports.close = function () {
    logger.info(TITLE, startIcon, colors.cyan('close'), 'project in', colors.underline(config.dist))
    return exports.isOpenPort().then(function (isOpen) {
        if (!isOpen) {
            logger.warn(TITLE, '[skip] 跳过关闭项目,请打安装[微信开发工具]并打开[端口设置]');
        } else if (!fs.existsSync(path.resolve(config.dist, 'project.config.json'))) {
            logger.warn(TITLE, '[skip] 跳过关闭项目,', config.dist + '/project.config.json', '不存在');
        } else {
            return devtool.cli('--close', path.resolve(config.dist))
                .then(function (res) {
                    if (res.stderr) {
                        errLog({ name: '微信开发工具关闭项目出错', message: res.stderr.trim() });
                    } else {
                        logger.info(TITLE, colors.gray('正在开发工具中关闭此项目... (3秒内勿对其操作)'))
                        return new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }).then(function (res) {
                    logger.info(TITLE, successIcon, colors.green('已在微信开发工具中关闭此项目'));
                    return res;
                });
        }
    })

}

/**
 * 退出
 */
exports.quit = function () {
    logger.info(TITLE, startIcon, colors.cyan('quit'), colors.gray('尝试关闭开发工具...'))
    return exports.isOpenPort().then(function (isOpen) {
        if (isOpen) {
            return devtool.cli('--quit', path.resolve(config.dist))
                .then(function (res) {
                    if (res.stderr) {
                        errLog({ name: 'fail to call wechatdevtools CLI', message: res.stderr.trim() });
                    } else {
                        logger.info(TITLE, colors.gray('正在退出开发工具... (3秒内勿对其操作)'))
                        return new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }).then(function (res) {
                    logger.info(TITLE, successIcon, colors.green('已关闭并退出微信开发工具'));
                    return res;
                });
        } else {
            logger.info(TITLE, colors.gray('[skip] 跳过退出项目'));
        }
    });
}

function getSize(path) {
    try {
        const size = require(path).size.total;
        let color;
        if (size < 512) {
            color = colors.green;
        } else if (size < 1024) {
            color = colors.magentaBright
        } else if (size < 1536) {
            color = colors.bold.yellowBright
        } else {
            color = colors.bold.red
        }
        return colors.gray('(') + color(size + ' KB') + colors.gray(')');
    } catch (err) {
        logger.error(TITLE, err);
        return colors.dim.yellowBright('[unknown size]');
    }
}
/**
 * 上传
 */
exports.upload = function () {
    const version = devtool.getPkgVersion() || '0.0.0';
    const uploadProject = version + '@' + path.resolve(config.dist);
    logger.info(TITLE, startIcon, colors.cyan('upload'), 'project in', colors.underline(uploadProject));
    const logPath = path.join(os.tmpdir(), 'mplog-' + version + '-' + Date.now() + '.json')

    return devtool.getCommitMsg()
        .then(function (message) {
            message = (message || process.env.npm_package_description || '').trim().substr(0, 2048)
            logger.info(TITLE, colors.gray(message.split('\n', 1)[0]))
            return devtool.cli('--upload', uploadProject, '--upload-info-output', logPath, '--upload-desc', encodeURI(message))
        })
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: 'fail to upload prject ' + uploadProject, message: res.stderr.trim() });
            } else {
                logger.info(
                    TITLE,
                    successIcon,
                    colors.green('成功上传此项目至微信小程序后台!')
                    , getSize(logPath)
                );
                logger.info(TITLE, colors.gray('(多人开发时,可能需要管理员选定体验版)'))
                // require('rimraf')(logPath);
            }
        })
}

/**
 * 自动预览
 */
exports.autopreview = function () {
    //cli --auto-preview /Users/username/demo --auto-preview-info-output /Users/username/info.json
    logger.info(TITLE, startIcon, colors.cyan('auto preview'), 'project in', colors.underline(config.dist));
    const logPath = path.resolve(os.tmpdir(), 'mp-preview-log.' + Date.now() + '.json');
    return devtool.cli('--auto-preview', path.resolve(config.dist), '--auto-preview-info-output', logPath)
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: 'fail to call wechatdevtools CLI', message: res.stderr.trim() });
            }
        }).then(function (res) {
            logger.info(
                TITLE,
                successIcon,
                colors.green('已通过开发工具成功发布自动预览!'),
                getSize(logPath)
            );
            logger.info(TITLE, colors.gray(' 请打开手机微信（或在电脑端微信）上查看预览 :)'));
            require('rimraf')(logPath, function () { });
            return res;
        });
}


/**
 * 安装提示
 */
function warnNotInstelled() {
    logger.warn(TITLE, colors.yellowBright.bold('[!] ') + colors.yellowBright('小程序开发工具未安装'))
    logger.warn(TITLE, colors.yellowBright('    下载安装 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html'))
    logger.warn(TITLE, colors.yellowBright.bold('[!] ') + colors.yellowBright('Wechat devtools not found'))
    logger.warn(TITLE, colors.yellowBright('    download link https://developers.weixin.qq.com/miniprogram/en/dev/devtools/download.html'))
}


/**
 * 是否安装
 */
function isCliInstalled() {
    return devtool.getCLIPath().then(function (path) {
        if (!path) {
            warnNotInstelled();
        }
        return !!path;
    }).catch(() => {
        warnNotInstelled();
        return false;
    })
}

/**
 * 是否安装
 */
exports.isOpenPort = function () {
    return devtool.getPort().then(function (port) {
        if (!port) {
            logger.warn(TITLE, '[skip] 微信开发工具端口未开启或启动 已自动跳过...');
        }
        return port > 0;
    }).catch(() => {
        logger.warn(TITLE, '[skip] 微信开发工具端口未开启或启动 已自动跳过...');
        return false;
    })
}

exports.tryOpen = function () {
    return isCliInstalled().then(function (isInstalled) {
        if (isInstalled) {
            return exports.open()
        } else {
            logger.error(
                TITLE,
                '无法自动打开调试工具!',
                colors.red('(请先安装' +
                    colors.bold.magentaBright('[微信开发工具]') + '并' +
                    colors.bold.magentaBright('[打开端口设置]') +
                    ')'));
        }
    })
}