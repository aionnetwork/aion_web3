# Aion Compatible Web3 

## About
This project contains tools for using the Web3 application programming interface on top of the Aion network.

## Requirements

* **Node.js** version 8.9.1

Download: https://nodejs.org/en/download/

Check version by running `node -v` in a terminal.

* **npm**  version 5.5.1

Typically included with node installation.

Check version by running `npm -v` in a terminal.

* **gulp** version 3.9.1

Installation: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

Check version by running `guilp -v` in a terminal.

**Note:** Other versions may work, but have not been thoroughly tested at present.

## Setup

```bash
git clone https://github.com/aionnetwork/aion_web3
cd aion_web3
npm install
gulp build
```

or

```bash
npm install --save aion-web3
```

## Usage
This application programming interface can be used to perform different operation on the Aion blockchain.
Some example uses cases are available in the project wiki.

* Web use: include `dist/web3.min.js` in your html file
* Node use: `var Web3 = require('aion-web3')`

## Application Development
```js
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
```

