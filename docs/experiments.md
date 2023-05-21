# Experiments Guide
## Configure your experiment
The first step is configure the experiment using the [template](../experiments/template/exp_template.json). You can create a copy or update the own template.

The mandatory configuration in the template are:
- **Name**: The name for the experiment with underscores
- **Period**: Data range to analyze data
- **Time Between**: Waiting time between ESC
- **Config**: ESC configuration. All params are not mandatory, you can indicate those that you want to modify.

This is the structure of the template. The ESC config are the default value for the Falcon template
```JSON
{
    "name": "experiment_name",
     "period" : {
        "from" : "Start date to analyze data. Format: aaaa-mm-ddThh:mm:ss.sssZ",
        "to" : "End date to analyze data. Format: aaaa-mm-ddThh:mm:ss.sssZ",
        "config" : {
            "executionTime": 20000,
            "analysisFrequency": 30,
            "harvestFrequency": 30,
            "analysisStartDelay": 15,
            "harvestStartDelay": 0,
            "dataTimeLimit": 90,
            "frequencyControlCalculate": 1,
            "maximumTimeAnalysis": 3.2,
            "minimumTimeAnalysis": 3,
            "elasticityMode": "timeWindow",
            "experimentName": "test",
            "coldStart": false,
            "numberOfESCs": 2,
            "dataPerHarvest": 10,
            "analysisRetryTime": 500,
            "numberOfTimesForAnalysisAvg": 5,
        }
    },
    "timeBetween" : [
        200, 200
    ]
}
```

## Execute the experiment
To start the experiment execute the next command:
```
fides run -f <Path to the experiment config> -a <path to agreement json file> --print
```
By default these params values are:
- Experiment config [file](../experiments/template/exp_template.json): *../experiments/template/exp_template.json*
- SLA Agreement [Bluejay](../src/agreements/bluejay_ansX.json): *../src/agreements/bluejay_ansX.json*

The *print* param is optional. If you indicate this one, at the end of the experiment a file with some interesting graphics with the results will be generated

## Troubleshooting
If you get some error related to the *blockchain* when you execute a new experiment, you can't stop it with the nexts steps:
1. Open a terminal and go to *.esc/elastics-smart-contracts*
    ```
    cd esc/elastics-smart-contracts
    ```
1. Stop the *blockchain* executing the next command:
    ```
    ./stop.sh
    ```