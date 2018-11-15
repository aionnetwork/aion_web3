# aion-web3-core

This is a sub package of [aion_web3][repo].

The core package contains core functions for aion_web3 packages.

Please read the [documentation](https://docs.aion.network/docs/web3) for more information.


## Installation

### Node.js

```bash
npm install aion-web3-core
```


## Usage

```js
// in node.js
var core = require('aion-web3-core');

var CoolLib = function CoolLib() {

    // sets _requestmanager and adds basic functions
    core.packageInit(this, arguments);
    
};


CoolLib.providers;
CoolLib.givenProvider;
CoolLib.setProvider();
CoolLib.BatchRequest();
CoolLib.extend();
...
```

[repo]: https://github.com/aionnetwork/aion_web3


