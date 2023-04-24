// Default values

export const infrastructure = {
    directory: 'infrastructure',
    docker: {
        path: 'docker-falcon/docker-compose-local.yaml'
    },
    agreement: {
        name: 'bluejay',
        path: {
            from: './src/agreements/bluejay_ans.json',
            to: './infrastructure/assets/public/renders/tpa/agreements',
            prometheus: './infrastructure/assets/public/prometheus/targets.json'
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
            network: 'network/connection'
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