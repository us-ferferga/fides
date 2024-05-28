import { spawnSync } from "child_process";
import * as files from './files.js';
import { curlWithRetry, sleep } from "./utils.js";
import * as config from '../config/config.js';
import path from "path";

/**
 * @description Configure infrastructure for the agreement
 * @param file - Path to experiment configuration file
 * @param agreement - Path to agreement file
 */
export function configure(file, agreement) {
    // Read Experiment Data template file
    let rawExpData = files.readFile(file);
    let experimentData = JSON.parse(rawExpData);
    let expConfig = experimentData.config;
    let expName = experimentData.name;
    let expNameFile = expName + '.json';
    let escsNumber = expConfig.escsNumber;
    if (escsNumber != experimentData.timeBetween.length) {
        throw new Error('The esc number doesn\'t correspond with the time between list');
    }
    if (!experimentData.config.hasOwnProperty('chaincodeName')) {
        throw new Error('Specifiy in the config the chaincodeName param with the format \'nameX\'');
    }
    const periodExample = {
        "period" : {
            "from": 'aaaa-mm-ddThh:mm:ss.sssZ',
            "to": 'aaaa-mm-ddThh:mm:ss.sssZ'
        }
    }
    if (!experimentData.hasOwnProperty('period')) {
        throw new Error(`Specifiy the data period information:\n${JSON.stringify(periodExample, null, 2)}`);
    }
    // Copy to experiments results folder
    const experimentCopyPath = config.experiments.path.results;
    files.mkdir(experimentCopyPath);
    let expTargetFile = path.join(experimentCopyPath, expNameFile);
    files.copy(file, expTargetFile);

    // Read Config file from the elastic-smart-contract/esc-template folder
    let configFile = config.experiments.path.escCconfig;
    let rawConfigData = files.readFile(configFile);
    let escConfig = JSON.parse(rawConfigData);

    // Read agreement data
    let rawAgreementData = files.readFile(agreement);
    let agreementData = JSON.parse(rawAgreementData);
    let agreementId = agreementData.id + 'X';
    // Update resultsPath config
    escConfig.resultsPath = path.join(config.experiments.path.results, expName, agreementId);
    escConfig.experimentName = expName;
    files.writeFile(configFile, JSON.stringify(escConfig, null, 2));

    //POST registry
    let agreementsIds = [];
    for (let i = 1; i <= escsNumber; i++) {
        let newAgreementData = JSON.parse(rawAgreementData);
        let newId = agreementData.id + i;
        newAgreementData.id = newId;
        agreementsIds.push(newId);
        let dataBody = JSON.stringify(newAgreementData, null, 2);
        curlWithRetry([config.experiments.endpoint.registry.agreement, '-H', 'Content-Type: application/json', '-d', dataBody], { stdio: "inherit" });
    }
    let executeConfig = {
        expName: expName,
        agreementId: agreementData.id,
        agreementsIds: agreementsIds,
        period: experimentData.period,
        timeBetween: experimentData.timeBetween,
        elasticityMode: escConfig.elasticityMode
    }
    return executeConfig;
}

/**
 * @description Execute experiment
 * @param executeConfig - Experiment configuration
 */
export async function execute(executeConfig, print) {
    let endpoint = config.experiments.endpoint;
    curlWithRetry(["-X", "POST", endpoint.esc.down, '-s', '-o', '/dev/null'], { stdio: "inherit" });
    curlWithRetry(["-X", "POST", endpoint.esc.up, '-s', '-o', '/dev/null'], { stdio: "inherit" });
    await sleep(30);
    for (let i = 0; i < executeConfig.timeBetween.length; i++) {
        let setupPath = `${endpoint.registry.accountable}/${executeConfig.agreementsIds[i]}?from=${executeConfig.period.from}&to=${executeConfig.period.to}`;
        curlWithRetry([setupPath], { stdio: "inherit" });
        await sleep(executeConfig.timeBetween[i]);
    }
    let agreementIdsLength = executeConfig.agreementsIds.length;
    for (let i = 0; i < agreementIdsLength; i++) {
        let stopPath = `${endpoint.esc.stop}/${executeConfig.agreementsIds[i]}`;
        curlWithRetry(['-X', 'DELETE', stopPath], { stdio: "inherit" });
        if (i != agreementIdsLength) {
            await sleep(100);
        }
    }
    // Print graphic results
    let escPath = path.join(config.esc.directory,config.esc.repository.esc.name);
    let expName = executeConfig.expName;
    if (print) {
        let pythonPath = path.join(escPath,"printResults.py")
        spawnSync("python", [pythonPath, "-a", executeConfig.agreementId, '-e', expName, '-t', executeConfig.elasticityMode], { stdio: "inherit" });
        await sleep(3);
    }

    // Move results to experiments/results folder
    let resultsPath = config.experiments.path.results.replace('./', '');
    let experimentPath = path.join(escPath, resultsPath, expName);
    let experimentTargetPath = config.experiments.path.results;
    files.copy(experimentPath, experimentTargetPath);
}
