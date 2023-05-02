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
    spawnSync("sleep", [15], { stdio: "inherit" });
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
    console.log('Infrastructure configured');
}

/**
 * @description Load infrastructure data
 */
export function loadData() {
    console.log('Start load data');
    let dumpPath = config.infrastructure.dump;
    if (!files.directoryExists(dumpPath.backup)) {
        spawnSync("mkdir", [dumpPath.backup], { stdio: "inherit" });
    }
    if (!files.directoryExists(path.join(dumpPath.backup, dumpPath.mongo.directory))) {
        spawnSync("mkdir", [path.join(dumpPath.backup, dumpPath.mongo.directory)], { stdio: "inherit" });
    }
    if (!files.directoryExists(path.join(dumpPath.backup, dumpPath.influx.directory))) {
        spawnSync("mkdir", [path.join(dumpPath.backup, dumpPath.influx.directory)], { stdio: "inherit" });
    }
    const rawDeps = spawnSync('curl', ['http://localhost:5200/api/v1/public/database/dbRestore.js']);
    let dbStore = rawDeps.stdout;
    // Load Mongo dump
    spawnSync("cp", [dumpPath.mongo.from, dumpPath.mongo.to], { stdio: "inherit" });
    let mongoConfig = {
        "scriptText": dbStore.toString('utf-8'),
        "scriptConfig": {
            "dbName": 'mongo-registry',
            "dbUrl": 'mongodb://host.docker.internal:5001',
            "dbType": 'Mongo',
            "backup": dumpPath.mongo.file
        }
    }
    spawnSync("curl", [dumpPath.assets.restoreTask, '-H', 'Content-Type: application/json','--data', JSON.stringify(mongoConfig)], { stdio: "inherit" });
    spawnSync("sleep", [15], { stdio: "inherit" });
    // Load Influx dump
    spawnSync("cp", [dumpPath.influx.from, dumpPath.influx.to], { stdio: "inherit" });
    let influxConfig = {
        "scriptText": dbStore.toString('utf-8'),
        "scriptConfig": {
            "dbName": 'influx-reporter',
            "dbUrl": 'http://host.docker.internal:5002',
            "dbType": 'Influx',
            "backup": dumpPath.influx.file
        }
    }
    spawnSync("curl", [dumpPath.assets.restoreTask, '-H', 'Content-Type: application/json', '--data', JSON.stringify(influxConfig)], { stdio: "inherit" });
    spawnSync("sleep", [15], { stdio: "inherit" });
    spawnSync("curl", ["-X", "DELETE", config.experiments.endpoint.registry.agreement + '/bluejay_ans' + ''], { stdio: "inherit" });
    let rawAgreementData = files.readFile(config.experiments.path.agreement);
    spawnSync("curl", [config.experiments.endpoint.registry.agreement, '-H', 'Content-Type: application/json', '-d', rawAgreementData], { stdio: "inherit" });
    console.log('Finish load data');
}

/**
 * @description Down infrastructue from docker-compose
 * @param file - Path to docker compose file
 */
export function down(file) {
    const directory = config.infrastructure.directory;
    spawnSync("docker-compose", ["-f", `${directory}/${file}`, "--env-file", `${directory}/.env`, "down", "-v"], { stdio: "inherit" });
}