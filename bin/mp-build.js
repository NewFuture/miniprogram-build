#!/usr/bin/env node
///@ts-check
"use strict";
const colors = require("ansi-colors");
const config = require("../src/config");

function cb(str) { return colors.cyanBright.bold(str) }
function c(str) { return colors.greenBright.bold(str) }
function cw(str) { return colors.magentaBright.bold(str) }
function cd(str) { return colors.cyan.italic(str) }
function od(str) { return colors.italic(str) }
function odc(str) { return colors.reset.gray(str) }
function ed(str) { return colors.gray(str) }

var argv = require("yargs")
    .scriptName("mp")
    .usage(colors.whiteBright.bold.inverse("\nWechat MiniProgram build tools <微信小程序编译打包工具>\n"))
    .usage(`${colors.italic("Short Usage")} <短用法>: ${colors.bold.yellowBright("$0")} ${colors.cyanBright("[command...]")} ${colors.italic("[--option]")}`)
    .usage(`${colors.italic("Full Name")} <完整名称>: ${colors.bold.yellowBright("miniprogram-build")} ${colors.cyanBright("[命令...]")} ${colors.italic("[--选项]")}`)
    .example(colors.green.italic("$0 js js-watch"), ed("编译并监测生成js文件"))
    .example(colors.green.italic("$0 --config=mpconfig.json"), ed("指定配置文件"))
    .example(colors.green.italic("$0 --release --var.APP_ID=1234"), ed("优化编译,并替换变量{{APP_ID}}"))
    // configuration
    .pkgConf("mpconfig")
    .config(config.auto())
    .config("config", od(`JSONC config file ${odc("<配置置文件,命令参数优先级高于配置>")}`), config.load)
    .alias("c", "config")
    .help("help", od(`show help ${odc("<显示帮助信息>")}`))
    .alias("h", "help")
    .describe("version", od(`show version number ${odc("<查看本版号>")}`))
    .epilog(colors.italic(colors.gray("2018 - " + new Date().getFullYear()) + " " + colors.cyan.dim("@ NewFuture")))
    .option("production", {
        describe: od(`production mode ${odc("<发布模式会优化压缩>")}`),
        default: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
        boolean: true,
    })
    .alias("production", "release")
    .option("src", {
        describe: od(`source folder ${odc("<源文件目录>")}`),
        default: "src",
        type: "string",
    })
    .option("dist", {
        describe: od(`output folder ${odc("<编译输出目录>")}`),
        default: "dist",
        type: "string",
    })
    .option("exclude", {
        describe: od(`ignored files ${odc("<编译忽略文件(夹)>")}`),
        example: "types/**/*",
        array: true,
        string: true,
    })
    .option("tsconfig", {
        describe: od(`typescript config file ${odc("<TS配置,未设置会自动查找tsconfig.json>")}`),
        // default: '',
        // type:'string',
    })
    .option("copy", {
        describe: od(`files to copy ${odc("<复制的文件>")}`),
    })
    .option("var", {
        describe: od(`KEY value pair to replace in js/json ${odc("<替换JS和JSON中的变量>")}`),
        // type: 'object',
    })
    .option("assets", {
        describe: od(`assets folder under src/ for compling style, wont put to dist ${odc("<样式所需资源文件;会监测文件修改,但不会编译或复制到输出目录>")}`),
        default: "assets",
        type: "string",
    })
    // .showHelpOnFail(true,'--help for available options')
    .command(["*", "dev"], cd(`build and watch ${odc("<构建和检测文件修改>")}`))
    .command("init", cd(`create config file ${odc("<创建配置文件>")}`))
    .command(cb("build"), cd(`clean and compile ${odc("<清理和编译所有文件>")}`))
    .command(cw("watch"), cd(`watch file changes ${odc("<监测文件变化>")}`))

    .command(cb("clean"), cd(`remove all files in dist ${odc("<清理dist>")}`))
    .command(cb("compile"), cd(`compile all source files to dist ${odc("<编译所有源文件>")}`))
    .command(cb("js"), cd(`compile ts/js files to \`.js\` ${odc("<编译生成js>")}`))
    .command(cb("typescript"), cd(`compile ts files to \`.js\` ${odc("<编译ts>")}`))
    .command(cb("javascript"), cd(`compile all js as JavaScript ${odc("<编译js>")}`))
    .command(cb("wxs"), cd(`compile wxs/wxts to \`wxs\` ${odc("<编译生成wxs>")}`))
    .command(cb("wxts"), cd(`compile WeiXinTypeScript to \`wxs\` ${odc("<编译wxts>")}`))
    .command(cb("wxjs"), cd(`compile wxs as JavaScript ${odc("<编译wxs>")}`))
    .command(cb("wxss"), cd(`compile scss/sass/css/wxss to \`.wxss\` ${odc("<编译生成wxss>")}`))
    .command(cb("wxml"), cd(`compile html/wxml files to \`.wxml\` ${odc("<编译生成wxml>")}`))
    .command(cb("json"), cd(`compile all json/jsonc files to json ${odc("<编译生成json>")}`))
    .command(cb("image"), cd(`compresse all images in source to dist ${odc("<压缩所有图片>")}`))
    .command(cb("copy"), cd(`copy all files match \`copy\` ${odc("<复制需要复制的文件>")}`))
    .command(cb("npm"), cd(`build npm dependencies to dist ${odc("<编译npm依赖>")}`))

    .command(c("upload"), cd(`upload dist project ${odc("<上传小程序>")}`))
    .command(c("open"), cd(`open dist in wechat devtool ${odc("<开发工具中打开项目>")}`))
    .command(c("close"), cd(`close dist in Wechat devtool ${odc("<开发工具中关闭项目>")}`))
    .command(c("quit"), cd(`quit Wechat devtool ${odc("<退出开发工具>")}`))

    .command(cw("js-watch"), cd(`watch changes of ts/js files ${odc("<监测ts/js改动>")}`))
    .command("typescript-watch", false) //"watch changes of ts files ${odc("<监测ts改动>"
    .command("javascript-watch", false) // "watch changes of js files ${odc("<监测js改动>"
    .command(cw("wxs-watch"), cd(`watch changes of .wxs/.wxts ${odc("<监测.wxs/.wxts>")}`))
    .command("wxts-watch", false) //"watch changes of .wxts files ${odc("<监测wxts改动>"
    .command("wxjs-watch", false) //"watch changes of .wxs files ${odc("<监测wxs改动>"
    .command(cw("wxss-watch"), cd(`watch changes of scss/sass/css/wxss ${odc("<实时生成wxss>")}`))
    .command(cw("wxml-watch"), cd(`watch changes of html/wxml files ${odc("<实时生成wxml>")}`))
    .command(cw("json-watch"), cd(`watch changes of all json/jsonc files ${odc("<实时生成json>")}`))
    .command(cw("image-watch"), cd(`watch changes of all images in source ${odc("<实时压缩图片>")}`))
    .command(cw("copy-watch"), cd(`watch changes of \`copy\` files ${odc("<实时复制更新文件>")}`))
    .command(cw("npm-watch"), cd(`watch changes of npm dependencies ${odc("<实时更新npm依赖>")}`))
    .strict().argv;

Object.assign(config.default, argv, { $0: undefined, _: undefined });

if (argv._.length === 1 && argv._[0] === "init") {
    config.save(config.default);
} else {
    if (config.default.production) {
        process.env.NODE_ENV = "production"
    }
    const tasks = require("../src/task")
    tasks.$execute(argv._.length === 0 ? ["dev"] : argv._);
}

