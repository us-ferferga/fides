# Usage Guide
Please read the [Setup Guide](./docs/setup.md) and install all necessary components first.
## Infrastructure setup
To setup the infrastructure execute the next command:
```
fides setup infrastructure <infrastructure repository url> --env-file <path to .environment file> -f <Path to the docker-compose file> -a <path to agreement json file>
```
By default these params values are:
- Infrastructure repository url: Falcon infrastructure: https://github.com/governify/falcon-infrastructure.git
- Docker-compose file: *docker-falcon/docker-compose-local.yaml*
- SLA Agreement [Bluejay](./src/agreements/bluejay_ans.json)

This setup will load predefined data in order to execute experiments. You can see the data in the [dashboard](http://localhost:5600/dashboard/script/dashboardLoader.js?dashboardURL=http://localhost:5300/api/v4/dashboards/bluejay_ans/group-by-service) once the infrastructure setup is finished.

## Setup infrastructure
To setup the Elastic Smart Contracts framework execute the next command:
```
fides setup esc <esc repository url>
```
This command will start the server on port 6100

## Down
To turn everything off execute the next command:
```
fides down --clean -f <Path to the docker-compose file>
```
The *clean* param is optional. If you indicate this one, all folders and files generated will be removed.

By default the Docker-compose file path is *docker-falcon/docker-compose-local.yaml*

## Steps for Falcon infrastructure and Bluejay
1. Setup infrastructure
    ```
    fides setup infrastructure https://github.com/governify/falcon-infrastructure.git --env-file .env -a src/agreements/bluejay_ans.json
    ```
    In this [link](example.envfile) you can check the information that the *.env file* must contain for this use case
1. Setup ESC
    ```
    fides setup esc https://github.com/isa-group/esc-falcon.git
    ```

You are ready to start to [execute experiments](experiments.md)