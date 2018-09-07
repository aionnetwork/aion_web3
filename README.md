# Aion Compatible Web3 

## About
This project contains tools for using the Web3 application programming interface on top of the Aion network.

```sh
npm install --save aion-web3
```

## Requirements

* **Node.js** version 8.9.1 <br/>
    Download: https://nodejs.org/en/download/ <br/>
    Check version by running `node -v` in a terminal.

* **npm**  version 5.5.1 <br/>
    Typically included with node installation. <br/>
    Check version by running `npm -v` in a terminal.

* **gulp** version 3.9.1 <br/>
    Installation: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md <br/>
    Check version by running `gulp -v` in a terminal.

**Note:** Other versions may work, but have not been thoroughly tested at present.

## Development

```bash
git clone https://github.com/aionnetwork/aion_web3
cd aion_web3
npm install
npm run build
npm test
```

This application programming interface can be used to perform different operation on the Aion blockchain.
Some example uses cases are available in the project [wiki](https://github.com/aionnetwork/aion_web3/wiki).

* Web use:<br>
    &nbsp;&nbsp;&nbsp;&nbsp;include `dist/web3.min.js` in your html file
* Node use: 

```js
var Web3 = require('aion-web3')
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```
