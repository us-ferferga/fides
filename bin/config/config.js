// Default values

export const infrastructure = {
    directory: 'infrastructure',
    docker: {
        path: 'docker-falcon/docker-compose-local.yaml',
        mongoURL: 'mongodb://host.docker.internal:5001',
        governifyState: {
            port: '6200:80',
            image: 'alesancor1/governify-states-exporter',
            container: 'governify-states-exporter'
        }
    },
    agreement: {
        name: 'bluejay',
        path: {
            from: './src/agreements/bluejay_ans.json',
            to: './infrastructure/assets/public/renders/tpa/agreements',
            prometheus: './infrastructure/assets/public/prometheus/targets.json'
        }
    },
    dump: {
        backup: './infrastructure/assets/public/database/backups',
        mongo: {
            directory: 'mongo-registry',
            file: '6-5-2023-dump_mongo-registry.zip',
            from: './src/data/6-5-2023-dump_mongo-registry.zip',
            to:'./infrastructure/assets/public/database/backups/mongo-registry'
        },
        influx: {
            directory: 'influx-reporter',
            file: '6-5-2023-dump_influx-reporter.zip',
            from: './src/data/6-5-2023-dump_influx-reporter.zip',
            to:'./infrastructure/assets/public/database/backups/influx-reporter'
        },
        assets:{
            restoreFile: './infrastructure/assets/public/database/dbRestore.js',
            restoreTask: 'http://localhost:5800/api/v1/tasks/test'
        }
    }
}

export const esc = {
    directory: 'esc',
    repository: {
        esc: {
            name: 'elastic-smart-contracts',
            url: 'https://github.com/isa-group/elastic-smart-contracts.git',
            template: 'esc-template',
            infrastructure: 'infrastructure.yaml',
            network: 'network/connection',
            results: 'experiments/runs'
        },
        analyzer: {
            name: 'esc-analyzer',
            url: 'https://github.com/governify/esc-analyzer.git',
            path: {
                api: './esc/esc-analyzer/api',
                controllers: './esc/esc-analyzer/controllers',
                index: './esc/esc-analyzer/index.js',
                server: './esc/esc-analyzer/server.js'
            }
        }
    },
    hyperledger: {
        directory: 'fabric-samples',
        bin: 'bin',
        fabricVersion: '2.4.0',
        caVersion: '1.4.9'
    }
}

export const experiments = {
    path: {
        results: './experiments/runs',
        template: './experiments/template/exp_template.json',
        agreement: './src/agreements/bluejay_ansX.json',
        escCconfig: './esc/elastic-smart-contracts/esc-template/config.json'
    },
    endpoint: {
        registry: {
            agreement: 'http://localhost:5400/api/v6/agreements',
            accountable: 'http://localhost:5400/api/v6/setUpAccountableRegistry'
        },
        esc: {
            up: 'http://localhost:6100/api/v1/startup',
            down: 'http://localhost:6100/api/v1/shutdown',
            stop: 'http://localhost:6100/api/v1/stop',
            downServer: 'http://localhost:6100/down'
        }
    }
}