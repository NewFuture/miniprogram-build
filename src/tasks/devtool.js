
const path = require('path');
const os = require('os');
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
    logger.info(TITLE, 'closing project ' + colors.underline.gray(config.dist))
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
                errLog({ name: 'fail to call wechatdevtools CLI', message: res.stderr.trim() });
            } else {
                return new Promise(resolve => setTimeout(resolve, 3000));
            }
        }).then(function (res) {
            logger.info(TITLE, '[√] 已经退出微信开发工具');
            return res;
        });
}

exports.upload = function () {
    const version = devtool.getPkgVersion() || '0.0.0';
    const uploadProject = version + '@' + path.resolve(config.dist);
    logger.info(TITLE, 'uploading project: ' + colors.underline(uploadProject))
    const logPath = path.join(os.tmpdir(), 'mplog-' + version + '-' + Date.now() + '.json')

    return devtool.getCommitMsg()
        .then(function (message) {
            message = (message || process.env.npm_package_description || '').trim('').substr(0, 2048)
            logger.info(TITLE, colors.gray(message.split('\n', 1)[0]))
            return devtool.cli('--upload', uploadProject, '--upload-info-output', logPath, '--upload-desc', encodeURI(message))
        })
        .then(function (res) {
            if (res.stderr) {
                errLog({ name: 'fail to upload prject ' + uploadProject, message: res.stderr.trim() });
            } else {
                const size = require(logPath).size.total;
                logger.info(
                    TITLE,
                    colors.green.bold('√ ') +
                    colors.green(config.dist + ' 上传成功 !')
                    + colors.gray(' (') + colors.bold.magentaBright(size + ' KB') + colors.gray(')')
                );
                // require('rimraf')(logPath);
            }
        })
}

// gulp.task('close', () => devtool.cli('--close', $config.dist).then(() => new Promise(resolve => setTimeout(resolve, 3000))));
// gulp.task('quit', () => devtool.cli('--quit').then(() => new Promise(resolve => setTimeout(resolve, 3000))));
// gulp.task('upload',)