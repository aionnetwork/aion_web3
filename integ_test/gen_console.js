let test_cfg = require('./_integ_test_config.js');

let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('../')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP))
let rustClient = new Web3(new Web3.providers.HttpProvider(test_cfg.RUST_IP))
var chai = require('chai');
var assert = chai.assert;

var bignum = 10 * 10 ^ 18;
var bn = 10456787634565768768761787000n;

let encodeBI = async(bigint) => {
    
    let arr = [bigint];
    let type= ['BigInteger']
    let coded = client.avm.contract._abi.encode(type,arr);    
    console.log(coded);
    let decoded = client.avm.contract.decode('BigInteger',coded);
    return decoded;
}

let encodeInt = async(int) => {
    let arr = [int];
    let type= ['int']
    let coded = client.avm.contract._abi.encode(type,arr);

    //let coded2 = client.avm.contract._abi.encode(['string'],["Hello World"]);
    //console.log("coded::0x414950303431546f6b656e437265617465640000000000000000000000000000:::",coded2);
    let decoded = client.avm.contract.decode('int',coded);
    //let test = client.avm.contract.decode("String","0x21000b48656c6c6f20576f726c64");
    //console.log("string:::::",test);
    return decoded;
}
let buf = [1254548120000000n, 32,0x1,20,null]

let encodeByte = async(byte) => {
    
    //let arr = [byte];
    let type= ['byte[]']
    let coded = client.avm.contract._abi.encode(type,byte);    
    console.log(coded);
    let decoded = client.avm.contract.decode('BigInteger',coded);
    return decoded;
}

describe('General Tests', () => {
  
  it('Get block 1000', done => {
      client.eth.getBlock(1000).then(res => {
        assert.equal(res.number,1000,"Get Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Get current block number', done => {
      client.eth.getBlockNumber().then(res => {
        assert.isNumber(res,"Get Current Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode int to BigNumber', done => {
      encodeInt(1000).then(res => {
        assert.equal(res,1000,"Encode Int Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });


  it('Encode -int to BigNumber', done => {
      encodeBI(BigInt(-10n)).then(res => {
        assert.equal(res,-10,"Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

 it('Encode int to BigNumber', done => {
      encodeBI(10n).then(res => {
        assert.equal(res,10,"Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode -int to BigNumber', done => {
      encodeBI(-10n).then(res => {
        assert.equal(res,-10,"Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode -int to BigNumber', done => {
      encodeBI(-1n).then(res => {
        assert.equal(res,-1,"Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

   it('Encode -int to BigNumber', done => {
      encodeBI(-10n).then(res => {
        assert.equal(res,"-10","Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode BigNumber', done => {
      encodeBI("10456787634565768768761787000").then(res => {
        assert.equal(res,"10456787634565768768761787000","Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode BigNumber var', done => {
      encodeBI(bn).then(res => {
        assert.equal(res,bn,"Encode BigNumber Block Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode BigNumber pow 18', done => {
      encodeBI(10000000000000000000n).then(res => {
        assert.equal(res,"10000000000000000000","Encode BigNumber Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode BigNumber pow 18 var', done => {
      encodeBI(bignum).then(res => {
        assert.equal(res,bignum,"Encode BigNumber Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode - BigNumber', done => {
      encodeBI("-10456787634565768768761787000").then(res => {
        assert.equal(res,"-10456787634565768768761787000","Encode - BigNumber Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode 10^19 BigNumber', done => {
      encodeBI("10000000000000000000").then(res => {
        assert.equal(res,'10000000000000000000',"Encode - BigNumber Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });
  it('Encode 9.3 BigNumber', done => {
      encodeBI("1254548120000000").then(res => {
        assert.equal(res,'1254548120000000',"Encode BigNumber Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  it('Encode Byte', done => {
      encodeByte(buf).then(res => {
        assert.equal(res,buf,"Encode  byte Failed!");        
        done();
      }).catch(err => {
        done(err);
      });
  });

  
})