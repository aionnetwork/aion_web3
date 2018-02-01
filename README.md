# Aion Compatible Web3 

## Requirements

* nodejs
* npm

## Setup

```bash
git clone https://github.com/aionnetwork/aion_web3
go to download folder then enter "npm install"
gulp build
```

## Usage

### for web
* include `dist/web3.min.js` in your html file.

### for nodejs 
* npm install {path-to-aion-web3-folder}

## Develop

Set a provider (HttpProvider)

```js
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
```