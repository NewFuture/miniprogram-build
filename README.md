# miniprogram-build

build miniprogram with typescript & scss 

## Features

* File Compile
  * `TS` => `js`
  * `scss/sass/css` => `wxss`
  * image compress
  * sourcemaps
  * watch all source files
* Multi Environment (生多个APP)
  * APPID
  * domain & other configs
* Support miniprogram native npm


## Todo
* [ ] init
* [ ] console verbose
* [ ] pages config
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
* default is dev

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
	"tsconfig": "tsconfig.json",
	"replace": {
        "REPLACE_KEY": "all {{REPLACE_KEY}} in json files will replaced by this"
	}
}
```