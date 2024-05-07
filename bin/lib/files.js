// File management

import fs from "fs";
import path from "path";
import { copySync, removeSync } from 'fs-extra/esm';

/**
 * @description Check if the file already exists 
 * @param file 
 * @returns True/False
 */
export function directoryExists(file) {
    return fs.existsSync(file);
}

/**
 * @description Performs a copy ensuring the correct recursivity and directory structure exits first
 * @param source
 * @param dest
 */
export function copy(src, dest) {
    const sourceStat = fs.statSync(src);
    const destStat = fs.statSync(dest, { throwIfNoEntry: false });

    if (sourceStat?.isDirectory() || destStat?.isDirectory()) {
        copySync(src, path.join(dest, path.basename(src)));
    } else {
        copySync(src, dest);
    }
}

/**
 * @description Recursively creates a directory
 * @param directory - Directory to create
 */
export function mkdir(directory) {
    if (!directoryExists(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

/**
 * @description Removes a file or a directory and its content
 * @param {string} path 
 */
export function remove(path) {
    removeSync(path);
}

/**
 * @description Write data in the target file
 * @param targetFile 
 * @param data 
 */
export function writeFile(targetFile, data) {
    fs.writeFile(targetFile, data, function writeFile(err) {
        if (err) return console.log(err);
    });
}

/**
 * @description Read file
 * @param file 
 * @return Data file 
 */
export function readFile(file) {
    return fs.readFileSync(file);
}

/**
 * @description Get file name
 * @param file
 * @return File name
 */
export function getFileName(file) {
    return path.basename(file);
}

/**
 * @description Get subdirectories of the folder
 * @param file
 * @return Directories name
 */
export function getDirectories(file) {
    return fs.readdirSync(file, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
}
