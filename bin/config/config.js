// Default values

export const infrastructure = {
    directory : 'infrastructure',
    docker : {
        path : 'docker-falcon/docker-compose-local.yaml'
    },
    agreement : {
        name : 'bluejay',
        path : {
            from : './src/agreements/bluejay_ans.json',
            to : './infrastructure/assets/public/renders/tpa/agreements',
            prometheus : './infrastructure/assets/public/prometheus/targets.json'
        }
    }
}