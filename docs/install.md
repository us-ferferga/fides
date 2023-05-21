# Setup Guide
In this guide we will install the project's software requirements to use FIDES CLI.

## Requirements
Software requirements:
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - Tested in version 2.32.1
- [cURL](https://curl.haxx.se/download.html) - Tested in version 7.84.0
- [Docker](https://www.docker.com/get-started/) - Tested in version 20.10.13
- [Go](https://go.dev/dl/) - Tested in version 1.19.6
- [Npm + Node](#nvm-and-node)
- [Python](#python)


### Nvm and Node
Install nvm to manage node versions [Download nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

To execute the project is necessary to use node version v16.19.1. Once nvm is installed, or if you have installed previously, execute:
```
nvm install 16.19.1
```

If you are using a different node version managed with nvm, execute `nvm use 16.19.1` to use the version.

### Python
[Download Python 2.7](https://www.python.org/downloads/)

You can use pyenv to manage python versions [Download pyenv](https://github.com/pyenv/pyenv)

Install matplotlib in order to display experiments results in as graphics
```
python -m pip install matplotlib 
```

## Steps
Once you have [installed all required](#requirements) softaware:

1. Create the working directory, e.g., *MyWorkspace*
    ```
    mkdir MyWorkspace
    cd MyWorkspace
    ```
1. Clone the repository [fides](https://github.com/isa-group/fides) into the working directory
    ```
    git clone https://github.com/isa-group/fides
    ```
1. Install the dependencies
    ```
    cd fides
    npm -g install
    ```

You are ready to [start](usage.md)