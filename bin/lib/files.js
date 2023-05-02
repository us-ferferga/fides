// File management

import fs from "fs";
import path from "path";

/**
 * @description Check if the file already exists 
 * @param file 
 * @returns True/False
 */
export function directoryExists(file) {
    return fs.existsSync(file);
}

/**
 * @description Write data in the target file
 * @param targetFile 
 * @param data 
 */
export function writeFile(targetFile, data) {
    fs.writeFile(targetFile, data, function writeFile(err) {
        if (err) return console.log(err);
        //console.log(`Updated file ${targetFile}`);
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