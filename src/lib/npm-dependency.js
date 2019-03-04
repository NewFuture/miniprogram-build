///@ts-check
"use strict";
const path = require("path");
const fs = require("fs");

/**
 *
 * @param {string} cwd
 * @returns {Record<string,object>} miniprogram components Dependencies
 * 
 */
function loadPackage(cwd) {
    return JSON.parse(fs.readFileSync(path.resolve(cwd, "package.json")).toString());
}
/**
 *
 * @param {string} modulePath
 * @returns {Record<string,string>} miniprogram components Dependencies
 * 
 */
function getDependencies(modulePath) {
    // read parse not require
    // for file may update
    const packageConfig = loadPackage(modulePath);
    return packageConfig.dependencies || {};
    // const dependencyNames = packageConfig.dependencies ? Object.keys(packageConfig.dependencies) : [];

    // return dependencyNames.reduce((dependencies, dependencyName) => {
    //     const modulePath = path.resolve(cwd, "node_modules", dependencyName);
    //     return Object.assign(
    //         dependencies,
    //         {
    //             [dependencyName]: modulePath,
    //         },
    //         // resolveDependencies(cwd, modulePath),
    //     );
    // }, {});
}

/**
 * 向上递归解析依赖路径
 * @param {string} name 
 * @param {string} modulePath 
 * @param {string} cwd 
 */
function resolveDependencyPath(name, modulePath, cwd) {
    cwd = path.normalize(cwd);
    modulePath = path.normalize(modulePath);
    do {
        const dependencyPath = path.resolve(modulePath, "node_modules", name);
        if (fs.existsSync(dependencyPath)) {
            return dependencyPath;
        }
        modulePath = path.dirname(modulePath)
    } while (cwd !== modulePath && modulePath !== '/' && modulePath);
    return ''
}

// /**
//  *
//  * @param {string} cwd
//  * @param {string} [modulePath]
//  */
// function resolveDependencies(cwd, modulePath) {
//     modulePath = modulePath || cwd;
//     // read parse not require
//     // for file may update
//     const packageConfig = JSON.parse(fs.readFileSync(path.resolve(modulePath, "package.json")).toString());
//     const dependencyNames = packageConfig.dependencies ? Object.keys(packageConfig.dependencies) : [];

//     return dependencyNames.reduce((dependencies, dependencyName) => {
//         const modulePath = path.resolve(cwd, "node_modules", dependencyName);
//         return Object.assign(
//             dependencies,
//             {
//                 [dependencyName]: modulePath,
//             },
//             // resolveDependencies(cwd, modulePath),
//         );
//     }, {});
// }


// /**
//  *
//  * @param {string} cwd
//  */
// // function getMiniprogramDistPath(cwd) {
// //     const packageConfig = require(path.resolve(cwd, "package.json"));
// //     return path.resolve(cwd, packageConfig.miniprogram || "miniprogram_dist");
// // }

// /**
//  * 筛选出 miniprogram components 式的包
//  * @param {Record<string,string>} dependencies  //{[key:string]:string}
//  * @param {string} cwd
//  * @returns {Record<string,string>} miniprogram components Dependencies
//  */
// function splitMiniProgramNpm(dependencies, cwd) {
//     /**
//      * @type {Record<string,string>}
//      */
//     const MpDependencies = {};
//     Object.keys(dependencies).forEach(function (name) {
//         const modulePath = dependencies[name];
//         const mpDistPath = getMiniprogramDistPath(modulePath);
//         if (mpDistPath && fs.existsSync(mpDistPath)) {
//             MpDependencies[name] = mpDistPath;
//             const depDependencies = getDependencies(dependencies[name]);
//             Object.keys(depDependencies).forEach(depName => {
//                 // const depPath = resolveDependencyPath(depName,modulePath,cwd)
//                 if (depName in dependencies) {
//                     // if(depPath === dependencies[depName]){
//                     //     // skip
//                     // }else{
//                     //     // resolve
//                     // }
//                     delete depDependencies[depName]
//                 } else if (depName in MpDependencies) {
//                     delete depDependencies[depName]
//                 } else {
//                     depDependencies[depName] = resolveDependencyPath(depName, modulePath, cwd)
//                 }
//             })
//             Object.assign(MpDependencies, splitMiniProgramNpm(depDependencies, cwd))
//             Object.assign(dependencies, depDependencies)
//             delete dependencies[name];
//         }
//     })
//     return MpDependencies;
// }

/**
 * 筛选出 miniprogram components 式的包
 * @param {string[]} dependencies 
 * @param {string} npmPath
 * @param {string} cwd
 * @returns {[Record<string,string>,Record<string,string>]} miniprogram components Dependencies
 */
function getMp_NpmDependencies(dependencies, npmPath, cwd) {
    /**
     * @type {Record<string,string>}
     */
    const MpDependencies = {};
    /**
     * @type {Record<string,string>}
     */
    const NpmDependencies = {};
    dependencies.forEach(function (name) {
        const modulePath = path.resolve(npmPath, 'node_modules', name);
        const packageConfig = loadPackage(modulePath);
        const mpDistPath = path.resolve(modulePath, packageConfig.miniprogram || "miniprogram_dist");

        if (mpDistPath && fs.existsSync(mpDistPath)) {
            // mp 组件
            MpDependencies[name] = mpDistPath;
            const depDependencies = Object.keys(getDependencies(modulePath));
            depDependencies.forEach(depName => {
                if (depName in dependencies) {
                    delete depDependencies[depName]
                } else if (depName in MpDependencies) {
                    delete depDependencies[depName]
                } else {
                    depDependencies[depName] = resolveDependencyPath(depName, modulePath, cwd)
                }
            })
            const depMpNpm = getMp_NpmDependencies(depDependencies, modulePath, cwd);
            Object.assign(MpDependencies, depMpNpm[0])
            Object.assign(NpmDependencies, depMpNpm[1])
        } else {
            // 普通NPM
            NpmDependencies[name] = path.resolve(modulePath, packageConfig.module || packageConfig["jsnext:main"] || packageConfig.main || "index.js");
        }
    })
    return [MpDependencies, NpmDependencies];
}

module.exports = {
    loadPackage,
    getDependencies,
    getMp_NpmDependencies,
    // resolveDependencies,
    // getMiniprogramDistPath,
    // splitMiniProgramNpm
}