///@ts-check
"use strict";

function getEnvLocale(env = process.env) {
    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || '';
}

const locale = getEnvLocale().replace(/[.:].*/, '');

const units = locale.toLowerCase().startsWith("zh") ?
    [
        { name: "纳秒", factor: 1 },
        { name: "微秒", factor: 1e3 },
        { name: "毫秒", factor: 1e6 },
        { name: "秒", factor: 1e9 },
        { name: "分", factor: 6e10 },
        { name: "小时", factor: 36e11 }
    ]
    : [
        { name: " ns", factor: 1 },
        { name: " us", factor: 1e3 },
        { name: " ms", factor: 1e6 },
        { name: " s", factor: 1e9 },
        { name: " min", factor: 6e10 },
        { name: " hr", factor: 36e11 }
    ]

function prettyTime(time, dec = 2) {
    for (let i = 0; i < units.length; i++) {
        const { name, factor } = units[i], scaledTime = time / factor;
        const maxVal = units[i + 1] && units[i + 1].factor / factor;
        const roundedTime = Number((scaledTime).toFixed(dec));
        // if time in cur unit is large enough to be the next unit, continue
        if (!maxVal || Math.abs(roundedTime) < maxVal) {
            return Number((scaledTime).toFixed(dec)) + name
        }
    }
}
module.exports = prettyTime;