#!/usr/bin/env node

import { spawnSync } from "child_process";
import * as files from "./lib/files.js";
import * as infrastructure from './lib/infrastructure.js';
import * as config from './config/config.js';
import * as esc from './lib/esc.js';
import * as experiments from './lib/experiments.js';
import { program } from "commander";
import { curlWithRetry } from "./lib/utils.js";

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

setup
    .command("infrastructure <url>")
    .requiredOption("--env-file <path>", "Path to the .env file")
    .requiredOption("-f, --file <path>", "Path to the docker-compose file", config.infrastructure.docker.path)
    .requiredOption("-a, --agreement <path>", "Path to the agreement file", config.infrastructure.agreement.path.from)
    .action((url, options) => {
        const { envFile, file, agreement } = options;
        infrastructure.deploy(url, envFile, file);
        infrastructure.configure(agreement);
        infrastructure.loadData();
    });

setup
    .command("esc <url>")
    .action((url, options) => {
        esc.configure(url);
        esc.init();
    });

program
    .command('run')
    .requiredOption("-f, --file <path>", "Path to the experiment config", config.experiments.path.template)
    .requiredOption("-a, --agreement <path>", "Path to the agreement file", config.experiments.path.agreement)
    .option("--print", "Print the graphs of results")
    .action((options) => {
        const { file, agreement, print } = options;
        const executeConfig = experiments.configure(file, agreement);
        experiments.execute(executeConfig, print);
    });

program
    .command('down')
    .option("--clean", "Remove all generated files")
    .requiredOption("-f, --file <path>", "Path to the docker-compose file", config.infrastructure.docker.path)
    .action((options) => {
        const { clean, file } = options;
        // Down ESC
        esc.down();
        const downServer = {
            "down": true
        }
        curlWithRetry([config.experiments.endpoint.esc.downServer, '-H', 'Content-Type: application/json', '-d', JSON.stringify(downServer, null, 2)], { stdio: "inherit" })
        // Down infrastructure
        infrastructure.down(file);
        if (clean) {
            files.remove(config.esc.directory);
            files.remove(config.esc.hyperledger.directory);
            files.remove(config.infrastructure.directory);
            const resultsContentPath = config.experiments.path.results;
            files.remove(resultsContentPath); // Remove experiments/runs content
        }
    });

/* Main program execution */
program.parse();
