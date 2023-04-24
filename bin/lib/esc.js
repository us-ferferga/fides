
import { spawnSync, execSync } from 'child_process';
import * as config from '../config/config.js';
import * as files from './files.js';
import path from 'path';

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
        spawnSync("cp", ["-r", path.join(hyperledger.directory, hyperledger.bin), escPath], { stdio: "inherit" });
    }
    // esc-analyzer repo (client)
    let analyzerPath = path.join(directory, repository.analyzer.name);
    if (!files.directoryExists(analyzerPath)) {
        spawnSync("git", ["clone", repository.analyzer.url, analyzerPath], { stdio: "inherit" });
        console.log(`Repository ${repository.analyzer.name} cloned in ${analyzerPath}`);
        spawnSync("cp", ["-r", repository.analyzer.path.api, escPath], { stdio: "inherit" });
        spawnSync("cp", ["-r", repository.analyzer.path.controllers, escPath], { stdio: "inherit" });
        spawnSync("cp", [repository.analyzer.path.index, escPath], { stdio: "inherit" });
        spawnSync("cp", [repository.analyzer.path.server, escPath], { stdio: "inherit" });
    }
    // esc repo
    let escName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".git"));
    let escDirPath = path.join(directory, escName);
    spawnSync("git", ["clone", url, path.join(directory, escName)], { stdio: "inherit" });
    console.log(`Repository ${escName} cloned in ${escDirPath}`);
    let escDirectory = files.getDirectories(path.join(escDirPath, 'esc'))[0];
    spawnSync("cp", ["-r", path.join(escDirPath, 'esc', escDirectory) + '/.', path.join(escPath, repository.esc.template)], { stdio: "inherit" });
    spawnSync("cp", [path.join(escDirPath, repository.esc.infrastructure), escPath], { stdio: "inherit" });
    // Install dependencies
    spawnSync("npm", ["install","--prefix", escPath], { stdio: "inherit" });
    spawnSync("npm", ["install","--prefix", escPath, "express", "governify-commons", "oas-tools@2.1.4"], { stdio: "inherit" });
    spawnSync("npm", ["install","--prefix", path.join(escPath, repository.esc.network)], { stdio: "inherit" });
    // Remove esc folders
    spawnSync("rm", ["-r", path.join(escPath, 'esc', 'intersection')], { stdio: "inherit" });
    spawnSync("rm", ["-r", path.join(escPath, 'esc', 'street1')], { stdio: "inherit" });
    spawnSync("rm", ["-r", path.join(escPath, 'esc', 'street2')], { stdio: "inherit" });
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