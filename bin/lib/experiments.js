import { spawn, spawnSync } from "child_process";
import * as files from './files.js';
import { sleep } from "./utils.js";
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
    // Copy to experiments results folder
    const experimentCopyPath = config.experiments.path.results;
    if (!files.directoryExists(experimentCopyPath)) {
        spawnSync("mkdir", [experimentCopyPath], { stdio: "inherit" });
    }
    let expTargetFile = path.join(experimentCopyPath, expNameFile);
    spawnSync("cp", [file, expTargetFile], { stdio: "inherit" });

    // Read Config file from the elastic-smart-contract/esc-template folder
    let configFile = config.experiments.path.escCconfig;
    let rawConfigData = files.readFile(configFile);
    let escConfig = JSON.parse(rawConfigData);
    // Assign new experiment data to config file in esc-template folder
    let escConfigs = Object.keys(escConfig);
    let expConfigEntries = Object.entries(expConfig);
    let data = expConfigEntries.map(([key, val] = entry) => {
        if (escConfigs.includes(key)) {
            escConfig[key] = val;
        }
    });

    // Read agreement data
    let rawAgreementData = files.readFile(agreement);
    let agreementData = JSON.parse(rawAgreementData);
    let agreementId = agreementData.id + 'X';
    // Assign char X to the agreement name in order to save results for each agreement
    /*let agreementName = files.getFileName(agreement).split('.')[0];
    if (agreementName.charAt(agreementName.length-1) != 'X') {
        agreementName += 'X';
    }*/
    // Update resultsPath config
    escConfig.resultsPath = path.join(config.experiments.path.results, expName, agreementId);
    files.writeFile(configFile, JSON.stringify(escConfig, null, 2));

    //POST registry
    //spawnSync("curl", ["-X", "DELETE", config.experiments.endpoint.registry.agreement], { stdio: "inherit" });
    let agreementsIds = [];
    for (let i = 1; i <= escsNumber; i++) {
        let newAgreementData = JSON.parse(rawAgreementData);
        let newId = agreementData.id + i;
        newAgreementData.id = newId;
        agreementsIds.push(newId);
        let dataBody = JSON.stringify(newAgreementData, null, 2);
        spawnSync("curl", [config.experiments.endpoint.registry.agreement, '-H', 'Content-Type: application/json', '-d', dataBody], { stdio: "inherit" });
    }
    let executeConfig = {
        expName: expName,
        agreementId: agreementData.id,
        agreementsIds: agreementsIds,
        period: experimentData.period,
        timeBetween: experimentData.timeBetween
    }
    return executeConfig;
}

/**
 * @description Execute experiment
 * @param executeConfig - Experiment configuration
 */
export async function execute(executeConfig, print) {
    let endpoint = config.experiments.endpoint;
    spawnSync("curl", ["-X", "POST", endpoint.esc.down, '-s', '-o', '/dev/null'], { stdio: "inherit" });
    spawnSync("curl", ["-X", "POST", endpoint.esc.up, '-s', '-o', '/dev/null'], { stdio: "inherit" });
    await sleep(30);//await sleep(10); //await sleep(30);
    for (let i = 0; i < executeConfig.timeBetween.length; i++) {
        let setupPath = `${endpoint.registry.accountable}/${executeConfig.agreementsIds[i]}?from=${executeConfig.period.from}&to=${executeConfig.period.to}`;
        //spawnSync("curl", [setupPath], { stdio: "inherit" });
        spawn("curl", [setupPath], { stdio: "inherit" });
        await sleep(executeConfig.timeBetween[i]);//await sleep(5); //await sleep(executeConfig.timeBetween[i]);
    }
    let agreementIdsLength = executeConfig.agreementsIds.length;
    for (let i = 0; i < agreementIdsLength; i++) {
        let stopPath = `${endpoint.esc.stop}/${executeConfig.agreementsIds[i]}`;
        //spawnSync("curl", ['-X', 'DELETE', stopPath], { stdio: "inherit" });
        spawn("curl", ['-X', 'DELETE', stopPath], { stdio: "inherit" });
        if (i != agreementIdsLength) {
            await sleep(100);
        }
    }
    // Print graphic results
    let escPath = path.join(config.esc.directory,config.esc.repository.esc.name);
    let expName = executeConfig.expName;
    if (print) {
        //python printResults.py -a bluejay_ans -e 4 
        //python esc/elastic-smart-contracts/printResults.py -a bluejay_ans -e Bluejay_3_timeWindow 
        let pythonPath = path.join(escPath,"printResults.py")
        spawnSync("python", [pythonPath, "-a", executeConfig.agreementId, '-e', expName], { stdio: "inherit" });
        await sleep(3);
    }

    // Move results to experiments/results folder
    let resultsPath = config.experiments.path.results.replace('./', '');
    let experimentPath = path.join(escPath, resultsPath, expName);
    let experimentTargetPath = config.experiments.path.results;
    spawnSync("cp", ["-r", experimentPath, experimentTargetPath], { stdio: "inherit" });
}