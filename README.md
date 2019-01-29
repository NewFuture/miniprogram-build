# miniprogram-build

build miniprogram with typescript & scss 

## Features

* `js`
    * [x] compile `TS`
    * [x] sourcemaps
    * [x] replace `{{var}}`
    * [x] build break
    * [x] JS support
    * [ ] tree shaking
    * [ ] one tslib
* `wxss`
    * [x] compile
        * `scss`/`sass`
        * `css`
    * [x] import `node_modules`
    * [x] sourcemaps
    * [x] minify (release) / expanded (debug)
    * [x] inline image
    * [x] inline svg
    * [x] PostCSS & cssnano & inline svg compress
    * [ ] keep import wxss
    * [x] build break when Invalid
    * [ ] skip local scss `_`
* `wxml/html` ==> `wxml`
    * [x] copy rename
    * [x] compress
* `svg` ==> `iconfonts`
    * [ ] svg ==> iconfont 
    * [ ] build wxss
*  `JSON`
    * [x] jsonc (添加注释)
    * [x] minify
    * [x] replace `{{var}}`
* resource
    * [x] copy/src
    * [x] image compress
* console verbose
    * [x] all files
    * [x] file size
* miniprogram native npm
    * [x] link node_modules
    * [ ] rollup js lib
    * [ ] components

## Todo
* [ ] exlude path
* [ ] init
* [ ] ~~pages config~~
* [ ] template project



## Usage

### install 

```
npm i miniprogram-build -D
```

### Command

> `mp-build [task] [--flags]`

task

* `build` compile all files from `src/` to `dist/`
* `watch` watch src files change and update dist
* `dev` = `build`+`watch`
* `clean` remove dist

flags

* `--config={CONFIG_FILE_JSON}` using config file
* `--debug` open debug mode
* `--release` build for release with optimization


examples

* dev in int env
```
mp-build dev --config=./config.int.json 
```
* build for prod release
```
mp-build build --config=./config.prod.json --release 
```

### default config

```json
{
    "release": false,
    "debug": false,
    "src": "src",
    "dist": "dist",
    "exclude": "",
    "tsconfig": "tsconfig.json",
    "var": {
        "APP_ID": "all {{APP_ID}} in json/ts files will replaced by this value"
    }
}
```
