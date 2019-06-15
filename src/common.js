///@ts-check
'use strict';

import json5 from 'json5';
import colors from 'ansi-colors';
import config, { defaultConfig } from './common/config';
import logger from './common/logger';

// const json5 = require('json5');
// const logger = require('./common/logger');

// const fs = require('fs');
// const colors = logger.colors;


/**
 * 全局配置
 */

// module.exports = {
//     colors,
//     logger,
//     json5,
//     loadConfig,
//     saveConfig,
//     autoLoadConfig,
//     config:defaultConfig,
// }

export {
    json5,
    config,
    defaultConfig,
    logger,
    colors
}