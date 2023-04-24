#!/usr/bin/env node

//import { spawnSync } from "child_process";
import * as infrastructure from './lib/infrastructure.js';
import * as config from './config/config.js';
import * as esc from './lib/esc.js';
import { program } from "commander";

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
    .requiredOption("-f, --file <path>", "Path to the docker-compose file", config.infrastructure.docker.path)
    .requiredOption("-a, --agreement <path>", "Path to the agreement file", config.infrastructure.agreement.path.from)
    .requiredOption("-d, --dump <path>", "Path to the dump file")
    .action((url, options) => {
        const { envFile, file, agreement } = options;
        infrastructure.deploy(url, envFile, file);
        infrastructure.configure(agreement);
        infrastructure.loadData(dump);
    });

const setupESC = setup
    .command("esc <url>")
    .action((url, options) => {
        esc.configure(url);
        esc.init();
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