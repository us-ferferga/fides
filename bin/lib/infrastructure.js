import { spawnSync } from "child_process";
import * as files from './files.js';
import * as config from '../config/config.js';
import path from "path";

/**
 * @description Up infrastructue from docker-compose
 * @param url - Infrastructure repository
 * @param envFile - Path to environment file
 * @param file - Path to docker compose file
 */
export function deploy(url, envFile, file) {
    const directory = config.infrastructure.directory;
    if (!files.directoryExists(directory)) {
        spawnSync("git", ["clone", url, directory], { stdio: "inherit" });
        console.log(`Repository cloned in ${directory}`);
    }
    spawnSync("cp", [envFile, `${directory}/.env`], { stdio: "inherit" });
    spawnSync("docker-compose", ["-f", `${directory}/${file}`, "--env-file", `${directory}/.env`, "up", "-d"], { stdio: "inherit" });
    console.log("Infrastructure up");
}

/**
 * @description Configure infrastructure for the agreement
 * @param agreement - Path to agreement file
 */
export function configure(agreement) {
    const agreementCopyPath = config.infrastructure.agreement.path.to;
    spawnSync("cp", [agreement, agreementCopyPath], { stdio: "inherit" });
    
    let rawdata = files.readFile(path.join(agreementCopyPath, files.getFileName(agreement)));
    let agreementData = JSON.parse(rawdata);
    let agreementId = agreementData.id;
    let agreementName = agreementData.id.split('_')[0];
    const targetFile = config.infrastructure.agreement.path.prometheus;
    let targetData = [
        {
            "targets": [`exporter.${agreementName}.governify.io`],
            "labels": {
                "__metrics_path__": "/metrics",
                "monitoring": agreementName
            }
        }
    ]
    files.writeFile(targetFile, JSON.stringify(targetData, null, 2));
}

/**
 * @description Load data
 * @param dump - Path to dump files
 */
export function loadData(dump) {
    // TODO: load infrastructure data
}