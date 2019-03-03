# miniprogram-build [![npm version](https://badge.fury.io/js/miniprogram-build.svg)](https://www.npmjs.com/package/miniprogram-build) [![Greenkeeper badge](https://badges.greenkeeper.io/NewFuture/miniprogram-build.svg)](https://greenkeeper.io/)

A command line tool to build & watch MiniProgram.

![task flow](https://user-images.githubusercontent.com/6290356/53295020-e13b7f00-382c-11e9-8662-5a5f5dcaeab9.png)

## Usage

### quick start

show all commands

```
npx miniprogram-build -h
```

### install as devDependence

```
npm i miniprogram-build -D
```

### CLI

> `miniprogram-build [command...] [--option]`

Short Alias [短命称]: `mp` 或 `mp-build`

Commands:

```
dev      build and watch <构建和检测文件修改>
watch    watch file changes <监测文件变化>
build    clean and compile <清理和编译所有文件>
clean    remove all files in dist <清理dist>
compile  compile all source files to dist <编译所有源文件>
js       compile ts/js files to `.js` <编译生成js>
wxs      compile wxts/wxs files to `.wxs` <编译生成wxs>
wxss     compile scss/sass/css/wxss to `.wxss` <编译生成wxss>
wxml     compile html/wxml files to `.wxml` <编译生成wxml>
json     compile all json/jsonc files to `.json` <编译生成json>
image    compresse all images in source to dist <压缩所有图片>
copy     copy all files match `copy` to dist <复制需要复制的文件>
npm      build npm dependencies to dist <编译npm依赖>
```

Options:

```
  --version     show version number <查看本版号>                       [boolean]
  --release     production mode <发布模式会优化压缩>  [boolean] [default: false]
  --src         source folder <源文件目录>           [string] [default: "src"]
  --dist        output folder <编译输出目录>        [string] [default: "dist"]
  --exclude     ignored files <编译忽略文件(夹)>                         [array]
  --tsconfig    typescript config file <TS配置,未设置会自动查找tsconfig.json>
  --copy        files to copy <复制的文件>
  --assets      assets folder under src/ for compling style, wont put to dist
                <样式所需资源文件;会监测文件修改,但不会编译或复制到输出目录>
                                                    [string] [default: "assets"]
  --var         KEY value pair to replace in js/json <替换JS和JSON中的变量>
  -c, --config  JSON config file <配置置文件,命令参数优先级高于配置>
  -h, --help    show help <显示帮助信息>                               [boolean]
```

examples

-   dev in int env

```
mp-build dev --config=./config.int.json
```

-   build for prod release

```
mp-build build --config=./config.prod.json --release
```

### default config

```json
{
    "release": false,
    "src": "src",
    "dist": "dist",
    "assets": "assets",
    "copy": "",
    "exclude": [],
    "tsconfig": "tsconfig.json",
    "var": {
        "APP_ID": "all {{APP_ID}} in json/ts files will replaced by this value"
    }
}
```

### commands & options

![commands & options](https://user-images.githubusercontent.com/6290356/53295185-f4504e00-3830-11e9-8bb0-31a533c8da7c.png)

### tips

* npm dependences need build npm via devtools (安装外部npm依赖需要开发工具并点击构建npm)
* CSS npm packags install as devDependences with `npm i -D` (CSS的 npm 依赖使用`npm i -D`方式安装)


## Features

* `js`
    * [x] compile `TS`
    * [x] sourcemaps
    * [x] replace `{{var}}`
    * [x] build break
    * [x] JS support
    * [x] error report
    * [ ] tree shaking
    * [ ] one tslib
* `wxs`
    * [x] compile `TS` (.wxts)
    * the same as js
* `wxss`
    * [x] compile
        * `scss`/`sass`
        * `css`
    * [x] import `node_modules`
    * [x] sourcemaps
    * [x] minify (release) / expanded (debug)
    * [x] inline image
    * [x] inline svg
    * [x] PostCSS 
        * autoprefixeer
        * cssnano & inline svg compress
    * [x] keep import wxss (MUST start with `/` and end with `.wxss`)
    * [x] build break when Invalid
    * [ ] ~~skip local scss `_`~~
    * [x] assest folder
    * [x] error report
* `wxml`
    * [x] `wxml`
    * [x] `html`
    * [x] copy rename
    * [x] compress
    * [x] error report
* `JSON`
    * [x] comments (添加注释)
    * [x] trailing comma
    * [x] minify
    * [x] replace `{{var}}`
    * [x] error report
* resource
    * [x] copy/src
    * [x] image compress
    * [x] error report
* console verbose
    * [x] all files
    * [x] file size


## Todo
* [x] exclude path
* [x] multi watcher
* [ ] ~~init~~
* [x] config
* [x] 显示报错位置
* [x] break errors
* [ ] ~~pages config~~
* [x] [template project](https://github.com/NewFuture/miniprogram-template)
* [ ] cache
* `svg` ==> `iconfonts`
    * [ ] svg ==> iconfont 
    * [ ] build wxss
* miniprogram native npm
    * [x] link node_modules
    * [ ] rollup js lib
    * [ ] components

## examples

[test](test/)

```
npm i
npm start

[21:30:23] config: v4.0.0 load config .mpconfig.jsonc
[21:30:23] clean: dist
[21:30:23] ↓↓↓↓↓↓ compiling src → dist ↓↓↓↓↓↓
[21:30:24] wxss: [►] app.scss → app.wxss
[21:30:24] json: [►] app.jsonc → app.json
[21:30:24] replace: {{APP_ID}} → 123456 (app.json)
[21:30:24] typescript: [►] app.ts → app.js
[21:30:24] replace: {{APP_ID}} → 123456 (app.ts)
[21:30:24] inline: assets\images\arrow-up.svg → (app.css)
[21:30:24] npm: [►] [miniprogram-image] → miniprogram_npm\miniprogram-image\
[21:30:24] npm: [►] [miniprogram-network] → miniprogram_npm\miniprogram-network\index.js
[21:30:24] npm: [►] [miniprogram-downloader] → miniprogram_npm\miniprogram-downloader\index.js
[21:30:24] npm: [►] [miniprogram-network-life-cycle] → miniprogram_npm\miniprogram-network-life-cycle\index.js
[21:30:24] npm: [►] [miniprogram-cancel-token] → miniprogram_npm\miniprogram-cancel-token\index.js
[21:30:24] npm: [►] [miniprogram-network-utils] → miniprogram_npm\miniprogram-network-utils\index.js
[21:30:24] npm: [►] [miniprogram-queue] → miniprogram_npm\miniprogram-queue\index.js
[21:30:24] npm: [►] [miniprogram-network-cache] → miniprogram_npm\miniprogram-network-cache\index.js
[21:30:24] npm: [►] [miniprogram-request] → miniprogram_npm\miniprogram-request\index.js
[21:30:24] npm: [►] [miniprogram-uploader] → miniprogram_npm\miniprogram-uploader\index.js
[21:30:25] image: icons\uEA01-arrow-down.svg  (saved 586 B - 76.8%)
[21:30:25] wxts: [►] wxs\comm.wxts → wxs\comm.wxs
[21:30:25] javascript: [►] lib\t.js → lib\t.js
[21:30:25] replace: {{APP_ID}} → 123456 (lib\t.js)
[21:30:25] wxml: [►] pages\index\index.html → pages\index\index.wxml
[21:30:25] wxss: [►] pages\index\index.scss → pages\index\index.wxss
[21:30:25] typescript: [►] lib\test.ts → lib\test.js
[21:30:25] npm: [►] [miniprogram-image] → miniprogram_npm\miniprogram-image\
[21:30:25] json: √ app.json (40 B)
[21:30:25] image: Done √ 1 file (177 B)
[21:30:25] wxss: √ app.wxss (3.5 kB)
[21:30:25] typescript: [►] pages\index\index.ts → pages\index\index.js
[21:30:28] npm: [►] [miniprogram-image] → miniprogram_npm\miniprogram-image\
[21:30:28] javascript: √ lib\t.js (286 B)
[21:30:28] npm: [miniprogram-image] √ index.js (2.72 kB)
[21:30:28] npm: [►] [miniprogram-image] → miniprogram_npm\miniprogram-image\
[21:30:28] wxml: √ pages\index\index.wxml (315 B)
[21:30:28] wxts: √ wxs\comm.wxs (674 B)
[21:30:28] typescript: √ app.js.map (431 B)
[21:30:28] npm: [miniprogram-image] √ index.json (23 B)
[21:30:28] wxss: √ pages\index\index.wxss (675 B)
[21:30:28] wxss: Done √ 2 files (4.17 kB)
[21:30:28] typescript: √ app.js (269 B)
[21:30:28] npm: [miniprogram-image] √ index.wxml (1.03 kB)
[21:30:28] typescript: √ lib\test.js.map (162 B)
[21:30:28] npm: [miniprogram-image] √ index.wxss (3.21 kB)
[21:30:29] npm: [miniprogram-image] Done √ 4 files (6.99 kB)
[21:30:29] typescript: √ lib\test.js (130 B)
[21:30:29] typescript: √ pages\index\index.js.map (235 B)
[21:30:29] typescript: √ pages\index\index.js (178 B)
[21:30:29] typescript: Done √ 6 files (1.41 kB)
[21:30:29] npm: [miniprogram-cancel-token] Done √ 1 file (1.65 kB)
[21:30:29] npm: [miniprogram-network] Done √ 1 file (4.39 kB)
[21:30:29] npm: [miniprogram-downloader] Done √ 1 file (2.21 kB)
[21:30:29] npm: [miniprogram-network-life-cycle] Done √ 1 file (6.47 kB)
[21:30:29] npm: [miniprogram-queue] Done √ 1 file (4.73 kB)
[21:30:29] npm: [miniprogram-uploader] Done √ 1 file (2.55 kB)
[21:30:29] npm: [miniprogram-request] Done √ 1 file (5.39 kB)
[21:30:29] npm: [miniprogram-network-cache] Done √ 1 file (4.99 kB)
[21:30:29] npm: [miniprogram-network-utils] Done √ 1 file (1.77 kB)
[21:30:29] ↑↑↑↑↑↑ √ finished compiling ↑↑↑↑↑↑
```