# Setup Guide
In this guide we will install the project's software requirements to use FIDES CLI.

## Requirements
Software requirements:
- git
- cURL
- Docker
- Go
- Npm + Node
- Python

### git
[Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

If you are running on MacOS execute:
```
brew install git
```

### cURL
[Download cURL](https://curl.haxx.se/download.html)

If you are running on MacOS execute:
```
brew install curl
```

### Docker
[Download Docker](https://www.docker.com/get-started/)

If you are running on MacOS execute:
```
brew install --cask docker
```
### Go
[Download Go](https://go.dev/dl/)

If you are running on MacOS execute:
```
brew install go
```

### Nvm + Node
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
    ```
1. Clone the repository [fides](https://github.com/isa-group/fides) into the working directory
1. Install the dependencies
    ```
    npm install
    ```

You are ready to [start to setup](usage.md) the infrasctructure and ESC framework