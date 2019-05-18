///@ts-check
"use strict";
const path = require('path');
const through = require('through2');

// const applySourceMap = require('vinyl-sourcemaps-apply');
const CleanCSS = require('../../vendor/clean-css/clean');
const PluginError = require('./error');

module.exports = (options, callback) => {

  let _callback = callback || (o => undefined);

  return through.obj(function (file, enc, cb) {

    let _options = Object.assign({}, options || {});

    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-clean-css', 'Streaming not supported!'));
      return cb(null, file);
    }

    if (file.sourceMap) {
      _options.sourceMap = JSON.parse(JSON.stringify(file.sourceMap));
    }

    const content = {
      [file.path]: {styles: file.contents ? file.contents.toString() : ''}
    };
    if (!_options.rebaseTo && _options.rebase !== false) {
      _options.rebaseTo = path.dirname(file.path);
    }

    // @ts-ignore
    new CleanCSS(_options).minify(content, (errors, css) => {

      if (errors) {
        return cb(errors.join(' '));
      }

      let details = {
        'stats': css.stats,
        'errors': css.errors,
        'warnings': css.warnings,
        'path': file.path,
        'name': file.path.split(file.base)[1]
      };

      if (css.sourceMap) {
        details['sourceMap'] = css.sourceMap;
      }
      _callback(details);

      file.contents = Buffer.from(css.styles);

      if (css.sourceMap) {
        const iMap = JSON.parse(css.sourceMap);
        const oMap = Object.assign({}, iMap, {
          file: path.relative(file.base, file.path),
          sources: iMap.sources.map(mapSrc => path.relative(file.base, mapSrc))
        });
        // applySourceMap(file, oMap);
      }
      cb(null, file);
    });
  });
};
