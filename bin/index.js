#!/usr/bin/env node

import { spawnSync } from "child_process";
import { program } from "commander";
import fs from "fs";

/* Configure the CLI */
program
    .name("fides")
    .description("Command line interface for Fides infrastructure")
    .usage("[command] [options]")
    .version("0.0.1", "-v, --version", "output the current version")
    .showHelpAfterError(true);

const setup = program
    .command("setup")
    .usage("[command] [options]")

const setupInfrastructure = setup
    .command("infrastructure <url>")
    .requiredOption("--env-file <path>", "Path to the .env file")
    .requiredOption("-f, --file <path>", "Path to the docker-compose file", "docker-compose.yml")
    .requiredOption("-a, --agreement <path>", "Path to the agreement file")
    .requiredOption("-d, --dump <path>", "Path to the dump file")
    .action((url, options) => {
        const { envFile, file } = options;
        deployInfrastructure(url, envFile, file);
        configureInfrastructure(agreement);
        loadInfrastructureData(dump);
    });

const setupESC = setup
    .command("esc")
    .action((options) => {
        console.log("setup esc")
    });

const run = program
    .command('run', 'Run the project', (yargs) => {
    console.log("run!")
});

const down = program
    .command('down', 'Bring down the project')
    .option("--clean", "Remove all generated files")
    .action((options) => {
});

/* Main program execution */
program.parse();

/* Infrastructure functions */
function deployInfrastructure(url, envFile, file) {
    spawnSync("git", ["clone", url, "infrastructure"], { stdio: "inherit" });
    spawnSync("cp", [envFile, "infrastructure/.env"], { stdio: "inherit" });
    spawnSync("docker-compose", ["-f", `infrastructure/${file}`, "--env-file", "infrastructure/.env", "up", "-d"], { stdio: "inherit" });
}

function configureInfrastructure(agreement) {
    // TODO: configure infrastructure
}

function loadInfrastructureData(dump) {
    // TODO: load infrastructure data
}