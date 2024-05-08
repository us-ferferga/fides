
import { spawnSync, execSync } from 'child_process';
import * as config from '../config/config.js';
import * as files from './files.js';
import path from 'path';
import { curlWithRetry } from './utils.js';

/**
 * @description Configure elastic-smart-contracts
 * @param url - ESC repository
 */
export function configure(url) {
    const directory = config.esc.directory;
    const hyperledger = config.esc.hyperledger;
    const repository = config.esc.repository;
    // Hyperledger binaries
    if (!files.directoryExists(hyperledger.directory)) {
        execSync(`curl -sSL https://bit.ly/2ysbOFE | bash -s -- ${hyperledger.fabricVersion} ${hyperledger.caVersion}`);
    }
    // elastic-smart-contract repo
    let escPath = path.join(directory,repository.esc.name);
    if (!files.directoryExists(escPath)) {
        spawnSync("git", ["clone", repository.esc.url, escPath], { stdio: "inherit" });
        console.log(`Repository ${repository.esc.name} cloned in ${escPath}`);
    }
    if (!files.directoryExists(path.join(escPath, hyperledger.bin))) {
        files.copy(path.join(hyperledger.directory, hyperledger.bin), escPath);
    }
    // esc-analyzer repo (client)
    let analyzerPath = path.join(directory, repository.analyzer.name);
    if (!files.directoryExists(analyzerPath)) {
        spawnSync("git", ["clone", repository.analyzer.url, analyzerPath], { stdio: "inherit" });
        files.copy(repository.analyzer.path.api, escPath);
        files.copy(repository.analyzer.path.controllers, escPath);
        files.copy(repository.analyzer.path.index, escPath);
        files.copy(repository.analyzer.path.server, escPath);
    }
    // esc repo
    let escName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".git"));
    let escDirPath = path.join(directory, escName);
    spawnSync("git", ["clone", url, path.join(directory, escName)], { stdio: "inherit" });
    console.log(`Repository ${escName} cloned in ${escDirPath}`);
    const escDirectory = files.getDirectories(path.join(escDirPath, 'esc'))[0];
    files.copy(path.join(escDirPath, 'esc', escDirectory) + '/.', path.join(escPath, repository.esc.template))
    files.copy(path.join(escDirPath, repository.esc.infrastructure), escPath)
    // Install dependencies
    spawnSync("npm", ["install","--prefix", escPath], { stdio: "inherit" });
    spawnSync("npm", ["install","--prefix", escPath, "express", "governify-commons", "oas-tools@2.1.4"], { stdio: "inherit" });
    spawnSync("npm", ["install","--prefix", path.join(escPath, repository.esc.network)], { stdio: "inherit" });
    // Remove esc folders
    files.remove(path.join(escPath, 'esc', 'intersection'));
    files.remove(path.join(escPath, 'esc', 'street1'));
    files.remove(path.join(escPath, 'esc', 'street2'));
}

/**
 * @description Init elastic-smart-contracts server
 */
export function init() {
    const directory = config.esc.directory;
    const repository = config.esc.repository;
    let escPath = path.join(directory,repository.esc.name);
    spawnSync("npm", ["start", "--prefix", escPath], { stdio: "inherit" })
}

/**
 * @description Down network
 */
export function down() {
    const endpoint = config.experiments.endpoint;
    curlWithRetry(["-X", "POST", endpoint.esc.down, '-s', '-o', '/dev/null'], { stdio: "inherit" });
}
