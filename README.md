# Aion Compatible Web3 

## About
This project contains tools for using the Web3 application programming interface on top of the Aion network.

## Requirements

* **Node.js** (recommended version: 10.x+) <br/>
    Download: https://nodejs.org/en/download/ <br/>
    Check version by running `node -v` in a terminal.

* **npm**  (recommended version: 6.x+) <br/>
    Typically included with node installation. <br/>
    Check version by running `npm -v` in a terminal.

**Note:** Other versions may work, but have not been thoroughly tested at present.

## Setup

```bash
git clone https://github.com/aionnetwork/aion_web3
cd aion_web3
npm install
```

or

```bash
npm install --save aion-web3
```

## API Use

This application programming interface can be used to perform different operation on the Aion blockchain.
Some example uses cases are available in the project [wiki](https://github.com/aionnetwork/aion_web3/wiki).

* Web use:<br>
    &nbsp;&nbsp;&nbsp;&nbsp;Run `npm run browserify` to produce `dist/web3.min.js` and include it in your html file
* Node use: 
    ```
    var Web3 = require('aion-web3')
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    ```

## Documentation

For API reference and tutorials, please consult our official [documentation](https://docs.aion.network/docs/web3).
