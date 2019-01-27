# miniprogram-build

build miniprogram with typescript & scss 

## Features

* `TS` => `js`
    * [x] compile
    * [x] sourcemaps
    * [ ] build break
    * [ ] tree shaking
    * [ ] one tslib
* `scss/sass/css` => `wxss`
    * [x] compile
    * [x] import node_modules
    * [x] sourcemaps
    * [x] minify (release) / expanded (debug)
    * [x] inline image
    * [x] inline svg
    * [x] PostCSS & cssnano & svg compress
    * [ ] keep import wxss
    * [ ] build break
    * [ ] skip local scss `_`
* `wxml/html` ==> `wxml`
    * [x] copy rename
    * [x] compress
* `svg` ==> `iconfonts`
    * [ ] svg ==> iconfont 
    * [ ] build wxss
*  `JSON`
    * [x] minify
    * [x] APPID or domain & other configs
* resource
    * [x] copy/src
    * [x] image compress
* console verbose
    * [x] all files
    * [x] file size

## Todo
* [ ] exlude path
* [ ] init
* [ ] ~~pages config~~
* [ ] template project
* build miniprogram native npm
    * [ ] rollup js lib
    * [ ] components


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
* default is `dev`

flags

* `--config={CONFIG_FILE_JSON}` using config file
* `--debug` open debug mode
* `--release` build for release with optimization


examples

* dev in int env
```
mp-build --config=./config.int.json 
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
    "ignore": "",
    "tsconfig": "tsconfig.json",
    "replace": {
        "APP_ID": "all {{APP_ID}} in json files will replaced by this value"
    }
}
```
