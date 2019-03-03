///@ts-check
"use strict";

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

/**
 * 
 * @param {number} number 
 * @returns {string}
 */
function prettyBytes(number) {
    if (!Number.isFinite(number)) {
        return 'NAN';
    }

    if (number < 1) {
        const numberString = number.toLocaleString(number, true);
        return numberString + ' B';
    }

    const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);
    number = Number((number / (1000 ** exponent)).toPrecision(3));
    const numberString = number.toLocaleString(number, true);

    const unit = UNITS[exponent];

    return numberString + ' ' + unit;
};

module.exports = prettyBytes;