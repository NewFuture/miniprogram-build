///@ts-check
'use strict';

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var rename = require('gulp-rename');
// var imagemin = require('gulp-imagemin');
var del = require('del');
var replace = require('gulp-replace');
// var postcss = require('gulp-postcss');
var gulpif = require('gulp-if');
var debug = require('gulp-debug');
var colors = require('ansi-colors');



var config = {
	release: false,
	debug: false,
	src: 'src',
	dist: 'dist',
	tsconfig: 'tsconfig.json',
	replace: {
	}
}


// Log for output msg.
function log() {
	var data = Array.prototype.slice.call(arguments);
	console.log.apply(false, data);
}

/**
 * 编译ts文件
 * @param {string} [tsFile] - 源文件，无则编译所有文件
 */
function compileTypeScript(tsFile) {
	var tsProject = ts.createProject(config.tsconfig);
	var src = tsFile ? gulp.src(tsFile, { base: config.src }) : tsProject.src();
	return src.pipe(tsProject())
		.js
		.pipe(gulp.dest(config.dist));
}
/**
 * 编译scss
 * @param {string} [scssFile] - 无则编译所有
 */
function compileScss(scssFile) {
	scssFile = scssFile || (config.src + '/**/*.{scss,sass,css}');
	return gulp.src(scssFile, { base: config.src })
		.pipe(sass({ errLogToConsole: true, outputStyle: 'expanded' })
			.on('error', sass.logError))
		.pipe(gulpif(Boolean(config.debug), debug({ title: '`compileScss` Debug:' })))
		// .pipe(postcss([lazysprite(lazyspriteConfig), pxtorpx(), base64()]))
		.pipe(rename({ 'extname': '.wxss' }))
		.pipe(replace('.scss', '.wxss'))
		.pipe(gulp.dest(config.dist))
}

/**
 * 图片压缩
 * @param {string} [imgFile] 
 */
function minifyImage(imgFile) {
	imgFile = imgFile || (config.src + '/**/*.{png,jpg,jpeg,svg,gif}');
	return gulp.src(imgFile, { base: config.src })
		// .pipe(newer(paths.dist.imgDir))
		// .pipe(imagemin({
		// 	progressive: true,
		// 	svgoPlugins: [{ removeViewBox: false }]
		// }))
		.pipe(gulp.dest(config.dist));
}

/**
 * 复制 Json文件
 * @param {string|string[]} [jsonFile] 
 */
function replaceJson(jsonFile) {
	jsonFile = jsonFile || (config.src + '/**/*.{json,jsonc}');
	var stream = gulp.src(jsonFile, { base: config.src })
	if (typeof config.replace === 'object') {
		for (var key in config.replace) {
			stream.pipe(replace(RegExp('\{\{' + key + '\}\}', 'g'), config.replace[key]))
		}
	}
	return stream.pipe(gulp.dest(config.dist));
}

// /**
//  * 复制 WXML
//  * @param {string|string[]} [wxmlFile] 
//  */
// function copyWXML(wxmlFile) {
// 	wxmlFile = wxmlFile || ([config.src + '**/*.{wxml,}']);
// 	return gulp.src(wxmlFile)
// 		.pipe(gulp.dest(config.dist));
// }


/**
 * 复制 其他文件
 * @param {string|string[]} [file] 
 */
function copyBasicFiles(file) {
	file = file || ([config.src + '/**/*', '!' + config.src + '/**/*.{ts,json,jsonc,scss,sass,css,png,jpg,jpeg,svg,gif}']);
	return gulp.src(file, { base: config.src })
		.pipe(gulp.dest(config.dist));
}


// clean 任务, dist 目录
function cleanDist() {
	return del(config.dist);
}


/**
 * 监测文件更改
 * @param {string} type 
 * @param {string} file 
 */
function watchHandler(type, file) {
	var extname = path.extname(file).toLowerCase();
	if (type === 'deleted') {
		// 删除
		switch (extname) {
			case '.scss': // SCSS 文件
				return del([file.replace(config.src, config.dist).replace(new RegExp(extname + '$'), '.wxss')]);

			case '.ts': // ts 文件
				return file.endsWith('.d.ts') ? Promise.resolve([]) : del([file.replace(config.src, config.dist).replace(new RegExp(extname + '$'), '.js')]);

			case '.json'://json
			case '.png':
			case '.jpg':
			case '.jpeg':
			case '.svg':
			case '.gif':
			//图片
			case '.wxml': // wxml
			default:
				return del([file.replace(config.src, config.dist)]);
		}
	} else {
		switch (extname) {
			case '.scss': // SCSS 文件
				return compileScss(file);

			case '.ts': // ts 文件
				return file.endsWith('.d.ts') ? Promise.resolve() : compileTypeScript(file);

			case '.json': //json 文件
				return replaceJson(file);

			case '.png':
			case '.jpg':
			case '.jpeg':
			case '.svg':
			case '.gif':
				//图片
				return minifyImage(file);

			case '.wxml': // wxml
			default:
				return copyBasicFiles(file);
		}
	}
};

//监听文件
function watch(cb) {
	gulp.watch([config.src], { ignored: /[\/\\]\./ })
		.on('change', function (file) {
			log(colors.yellow(file) + ' is changed');
			watchHandler('changed', file);
		})
		.on('add', function (file) {
			log(colors.green(file) + ' is added');
			watchHandler('add', file);
		})
		.on('unlink', function (file) {
			log(colors.magenta(file) + ' is deleted');
			watchHandler('deleted', file);
		});

	cb();
}

gulp.task('compileTypeScript', () => compileTypeScript());
gulp.task('compileScss', () => compileScss());
gulp.task('replaceJson', () => replaceJson());
gulp.task('minifyImage', () => minifyImage());
gulp.task('copyFiles', () => copyBasicFiles());

exports.config = config;
exports.watch = watch;
exports.compile = gulp.parallel(
	gulp.task('compileTypeScript'),
	gulp.task('compileScss'),
	gulp.task('replaceJson'),
	gulp.task('copyFiles'),
);

// 删除生成文件
exports.clean = gulp.parallel(cleanDist);


//注册构建任务
exports.build = gulp.series(
	exports.clean,
	exports.compile,
);

//注册开发Task
exports.dev = gulp.series(
	exports.clean,
	exports.compile,
	watch
);

exports.default = exports.dev;
