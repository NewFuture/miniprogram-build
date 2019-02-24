#!/usr/bin/env node
///@ts-check
"use strict";
var config = require("../src/load-config");
var tasks = require("../src/task");
var argv = require("yargs")
    .scriptName("mp")
    .usage("\nMiniProgram build tools <小程序编译打包工具>")
    .usage("Usage <用法>:\n  $0 [command...] [--option]")
    .usage("FullName <完整名称>:\n miniprogram-build [command...] [--option]")
    .example("$0 dev", "编译并监测文件变化")
    .example("$0 --config=mpconfig.json", "指定配置文件")
    .example("$0 --release --var.APP_ID=1234", "优化编译")
    // configuration
    .pkgConf("mpconfig")
    .config(config.default())
    .config("config", "JSON config file <配置置文件,命令参数优先级高于配置>", config.load)
    .alias("c", "config")
    .help("help", "show help <显示帮助信息>")
    .alias("h", "help")
    .describe("version", "show version number <查看本版号>")
    .epilog("2018 - " + new Date().getFullYear() + " @ NewFuture")
    .option("release", {
        describe: "production mode <发布模式会优化压缩>",
        default: false,
        boolean: true,
    })
    .option("src", {
        describe: "source folder <源文件目录>",
        default: "src",
        type: "string",
    })
    .option("dist", {
        describe: "output folder <编译输出目录>",
        default: "dist",
        type: "string",
    })
    .option("exclude", {
        describe: "ignored files <编译忽略文件(夹)>",
        example: "types/**/*",
        array: true,
        string: true,
    })
    .option("tsconfig", {
        describe: "typescript config file <TS配置,未设置会自动查找tsconfig.json>",
        // default: '',
        // type:'string',
    })
    .option("copy", {
        describe: "files to copy <复制的文件>",
    })
    .option("assets", {
        describe:
            "assets folder under src/ for compling style, wont put to dist <样式所需资源文件;会监测文件修改,但不会编译或复制到输出目录>",
        default: "assets",
        type: "string",
    })
    .option("var", {
        describe: "KEY value pair to replace in js/json <替换JS和JSON中的变量>",
        // type: 'object',
    })
    // .showHelpOnFail(true,'--help for available options')
    .command(["*", "dev"], "build and watch <构建和检测文件修改>")
    .command("watch", "watch file changes <监测文件变化>")
    .command("build", "clean and compile <清理和编译所有文件>")
    .command("clean", "remove all files in dist <清理dist>")
    .command("compile", "compile all source files to dist <编译所有源文件>")
    .command("js", "compile ts/js files to `.js` <编译生成js>")
    .command("typescript", "compile ts files to `.js` <编译ts>")
    .command("javascript", "compile all js as JavaScript <编译js>")
    .command("wxs", "compile wxs/wxts to `wxs` <编译生成wxs>")
    .command("wxts", "compile WeiXinTypeScript to `wxs` <编译wxts>")
    .command("wxjs", "compile wxs as JavaScript <编译wxs>")
    .command("wxss", "compile scss/sass/css/wxss to `.wxss` <编译生成wxss>")
    .command("wxml", "compile html/wxml files to `.wxml` <编译生成wxml>")
    .command("json", "compile all json/jsonc files to json <编译生成json>")
    .command("image", "compresse all images in source to dist <压缩所有图片>")
    .command("copy", "copy all files match `copy` <复制需要复制的文件>")
    .command("npm", "build npm dependencies to dist <编译npm依赖>")
    .command("js-watch", "watch changes of ts/js files <监测ts/js改动>")
    .command("wxs-watch", "watch changes of .wxs/.wxts <监测.wxs/.wxts>")
    .command("wxts-watch", "watch changes of .wxts files <监测wxts改动>")
    .command("wxjs-watch", "watch changes of .wxs files <监测wxs改动>")
    .command("wxss-watch", "watch changes of scss/sass/css/wxss <实时生成wxss>")
    .command("wxml-watch", "watch changes of html/wxml files <实时生成wxml>")
    .command("json-watch", "watch changes of all json/jsonc files <实时生成json>")
    .command("image-watch", "watch changes of all images in source <实时压缩图片>")
    .command("copy-watch", "watch changes of `copy` files <实时复制更新文件>")
    .command("npm-watch", "watch changes of npm dependencies <实时更新npm依赖>")
    .strict().argv;

Object.assign(tasks.$config, argv);
tasks.$execute(argv._.length === 0 ? ["dev"] : argv._);
