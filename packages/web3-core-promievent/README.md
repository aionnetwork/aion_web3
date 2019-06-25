# aion-web3-core-promievent

This is a sub package of [aion_web3][repo].

This is the PromiEvent package to return a EventEmitter mixed with a Promise to allow multiple final states as well as chaining.

Please read the [documentation](https://docs.aion.network/docs/web3) for more information.

## Installation

### Node.js

```bash
npm install aion-web3-core-promievent
```

## Usage

```js
// in node.js
var Web3PromiEvent = require('aion-web3-core-promievent');

var myFunc = function(){
    var promiEvent = Web3PromiEvent();
    
    setTimeout(function() {
        promiEvent.eventEmitter.emit('done', 'Hello!');
        promiEvent.resolve('Hello!');
    }, 10);
    
    return promiEvent.eventEmitter;
};


// and run it
myFunc()
.then(console.log);
.on('done', console.log);
```

[repo]: https://github.com/aionnetwork/aion_web3


