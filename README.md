# [miniprogram-build](https://github.com/NewFuture/miniprogram-build)

[![npm version](https://badge.fury.io/js/miniprogram-build.svg)](https://www.npmjs.com/package/miniprogram-build) 
[![Build Status](https://travis-ci.com/NewFuture/miniprogram-build.svg?branch=master)](https://travis-ci.com/NewFuture/miniprogram-build) 
[![Greenkeeper badge](https://badges.greenkeeper.io/NewFuture/miniprogram-build.svg)](https://greenkeeper.io/)
[![cnpm version](https://npm.taobao.org/badge/v/miniprogram-build.svg)](https://npm.taobao.org/package/miniprogram-build)

> A command line tool to build & watch MiniProgram. Not a Framework, just a tool.
>
> 小程序命令行构建工具。 不是开发框架,只是自动化的增强工具和开发流程。

[template project 模板项目](https://github.com/NewFuture/miniprogram-template)

![task flow](https://user-images.githubusercontent.com/6290356/56422894-43b87500-62dc-11e9-816c-24992b90f691.png)

## 使用 Usage

### 立即尝试 quick start

查看全部命令 show all commands (需要npm >= 5.2)

```
npx miniprogram-build -h
```

### 作为开发依赖项 install as devDependence

```
npm i miniprogram-build -D
```

### 命令参数 CLI

> `miniprogram-build [command...] [--option]`

Short Alias [短名称]: `mp` 或 `mp-build`

#### 命令 Commands:

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

#### 参数 Options:

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

#### 例子 examples

- 使用配置`config.dev.json`开发调试, dev with `config.dev.json`

```
npx miniprogram-build --config=config.dev.json
```

- 使用`config.prod.json`生产环境开启优化重新编译,rebuild for production release with `config.prod.json`

```
npx miniprogram-build build --config=./config.prod.json --release
```

- 编译替换`{{`_`APP_ID`_`}}`为1234567, compile the source and replace template var `{{`_`APP_ID`_`}}` with 123456
```
npx miniprogram-build compile --var.APP_ID=1234567
```
### 默认配置文件 default config

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

### 完整命令和参数 commands & options

![commands & options](https://user-images.githubusercontent.com/6290356/53295185-f4504e00-3830-11e9-8bb0-31a533c8da7c.png)

### tips

-   CSS npm packags install as devDependences with `npm i -D` (CSS 的 npm 依赖使用`npm i -D`方式安装)

## Features

-   `js`
    -   [x] compile `TS`
    -   [x] sourcemaps
    -   [x] replace `{{`_`VAR_NAME`_`}}`
    -   [x] tree shaking
-   `wxs`
    -   [x] compile `TS` (`.wxts`)
    -   [x] replace `{{`_`VAR_NAME`_`}}`
    -   [x] npm support
    -   [x] tree shaking
-   `wxss`
    -   [x] compile
        -   `scss`/`sass`
        -   `css`
    -   [x] import `node_modules`
    -   [x] sourcemaps
    -   [x] minify (release) / expanded (debug)
    -   [x] inline image
        -   svg datauri
        -   png/jpg base64
        -   image compress
    -   [x] clean-css
    -   [x] keep import wxss
    -   [x] assest folder
-   `wxml`
    -   [x] `wxml`
    -   [x] `html`
    -   [x] copy rename
    -   [x] compress
    -   [x] error report
-   `JSON`
    -   [x] comments (添加注释)
    -   [x] trailing comma
    -   [x] minify
    -   [x] replace `{{`_`VAR_NAME`_`}}`
-   miniprogram npm
    -   [x] rollup js lib
    -   [x] components
-   resource
    -   [x] copy/src
    -   [x] image compress
    -   [x] error report
-   console verbose
    -   [x] all files
    -   [x] file size

## Todo

-   [x] exclude path
-   [x] multi watcher
-   [x] config
-   [x] 显示报错位置
-   [x] break errors
-   [ ] cache

## test examples

see [test](test/)

```
npm i
npm start

[21:31:41] config: v0.0.0 load config .mpconfig.jsonc
[21:31:41] 0.clean: dist
[21:31:41] ↓↓↓↓↓↓ start compile: src → dist ↓↓↓↓↓↓
[21:31:42] 3.wxss: [►] app.scss → app.wxss
[21:31:42] 4.json: [►] app.jsonc → app.json
[21:31:42] replace: √ {{APP_ID}} → 123456 (app.json)
[21:31:42] 5.typescript: [►] app.ts → app.js
[21:31:42] replace: √ {{APP_ID}} → 123456 (app.ts)
[21:31:42] inline: assets\images\arrow-up.svg → (app.css)
[21:31:42] 6.image: icons\uEA01-arrow-down.svg  (saved 586 B - 76.8%)
[21:31:42] 2.npm: [►] <miniprogram-image(component)> → miniprogram_npm\miniprogram-image\index.js
[21:31:42] 2.npm: [►] <miniprogram-network> → miniprogram_npm\miniprogram-network\index.js
[21:31:42] 1.wxts: [►] wxs\comm.wxts → wxs\comm.wxs
[21:31:42] 7.javascript: [►] lib\t.js → lib\t.js
[21:31:42] replace: √ {{APP_ID}} → 123456 (lib\t.js)
[21:31:42] 3.wxss: [►] pages\index\index.scss → pages\index\index.wxss
[21:31:42] 5.typescript: [►] lib\test.ts → lib\test.js
[21:31:42] 2.npm: [►] <miniprogram-image(component)> → miniprogram_npm\miniprogram-image\index.json
[21:31:42] 1.wxts: [►] wxs\x.wxts → wxs\x.wxs
[21:31:42] 4.json: [√] app.json (40 B)
[21:31:42] 6.image: √ All 1 file done! (177 B)[1.06秒]
[21:31:42] 5.typescript: [►] pages\index\index.ts → pages\index\index.js
[21:31:44] 7.javascript: [√] lib\t.js (286 B)
[21:31:44] 2.npm: [►] <miniprogram-image(component)> → miniprogram_npm\miniprogram-image\index.wxml
[21:31:44] 3.wxss: [√] app.wxss (1.02 kB)
[21:31:44] 8.wxml: [√] pages\index\index.wxml (360 B)
[21:31:44] 2.npm: [►] <miniprogram-image(component)> → miniprogram_npm\miniprogram-image\index.wxss
[21:31:44] 3.wxss: [√] pages\index\index.wxss (562 B)
[21:31:44] 3.wxss: √ All 2 files done! (1.59 kB)[2.44秒]
[21:31:44] 5.typescript: [√] app.js.map (431 B)
[21:31:44] 5.typescript: [√] app.js (269 B)
[21:31:44] 2.npm: √<miniprogram-image(component)> All 4 files done! (6.99 kB)[2.05秒]
[21:31:44] 5.typescript: [√] lib\test.js.map (162 B)
[21:31:44] 5.typescript: [√] lib\test.js (130 B)
[21:31:44] 5.typescript: [√] pages\index\index.js.map (235 B)
[21:31:44] 5.typescript: [√] pages\index\index.js (178 B)
[21:31:44] 5.typescript: √ All 6 files done! (1.41 kB)[2.19秒]
[21:31:44] replace: √ {{APP_ID}} → 123456 (wxs\comm.wxs)
[21:31:44] 1.wxts: [√] wxs\comm.wxs (16.2 kB)
[21:31:44] 2.npm: √<miniprogram-network> All 1 file done! (28.3 kB)[2.48秒]
[21:31:44] 1.wxts: [√] wxs\x.wxs (66 B)
[21:31:44] 1.wxts: √ All 2 files done! (16.3 kB)[2.52秒]
[21:31:44] ↑↑↑↑↑↑ √ All compilation tasks done! ↑↑↑↑↑↑

```
