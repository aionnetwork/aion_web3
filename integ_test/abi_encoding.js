let test_cfg = require('./_integ_test_config.js');

console.log("Using cfg = ", test_cfg);

let fs = require('fs')
let path = require('path')
let async = require('async')
let Web3 = require('../')
let should = require('should')
let client = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
const crypto = require('crypto')

let typesBinPath = path.join(__dirname, 'contracts', 'Types.bin')
let typesAbiPath = path.join(__dirname, 'contracts', 'Types.abi')

function random(from, to){
    return Math.floor(Math.random() * (to - from + 1)) + from
}

function deployCt(ct, ctData, args, cb) { 
    console.log("SETUP: Deploying test contract...");
    return ct.deploy( {data: ctData, arguments: args} )
        .send()
        .on('error', err => { cb(err,null) })
        .on('transactionHash', transactionHash => { console.log('transactionHash', transactionHash) })
        .on('receipt', receipt => { 
            console.log('SETUP: Received transaction receipt for contract deployment.  txHash =',
                        receipt.transactionHash, 'contractAddress =', receipt.contractAddress);
            cb(null,receipt);
        });
        //.on('confirmation', (confirmationNumber, receipt) => { console.log(confirmationNumber, receipt) });
}


describe('fvm_contracts', () => {
  let opts = { 
      from: test_cfg.TEST_ACCT_ADDR,
      gas: test_cfg.GAS,
      gasPrice: test_cfg.GAS_PRICE,
  };

  let typesBin
  let typesAbi
  let ct;
  let ctInstAddress;

  before(done => {
    if( test_cfg.TEST_ACCT_ADDR.length == 0 ) { 
        done(Error("Error during setup.  No test account address was configured."));
    }

    let steps = {
      typesBin: async.apply(fs.readFile, typesBinPath),
      typesAbi: async.apply(fs.readFile, typesAbiPath),
      unlock: async.apply(client.eth.personal.unlockAccount, 
                          test_cfg.TEST_ACCT_ADDR , 
                          test_cfg.TEST_ACCT_PW),
      contract: ['typesAbi',async.apply(function (results,cb) {
          let ct = new client.eth.Contract(JSON.parse(results.typesAbi), opts);
          cb(null, ct);
      })],
      deploy: ['unlock', 'typesBin', async.apply(function (res,cb) {
          let deployedTo;
          deployCt(res.contract, res.typesBin.toString('utf8'), [], cb)
              .catch(err => {
                  console.error("error", err);
                  return done(err);
              });
      })]
    }
    async.auto(steps, (err, res) => {
      if (err !== null && err !== undefined) {
        console.error('error reading bin & abi', err)
        return done(err)
      }

      if(! res.unlock ) { 
        return done(new Error("can't unlock"));
      }

      typesBin = res.typesBin.toString('utf8')
      typesAbi = JSON.parse(res.typesAbi)
      ct = res.ct;
      ctInstAddress = res.deploy.contractAddress;

      //ctInstAddress = '0xA0Ce602629f0c53249D169460455a88Fc511E3ddfB361b821a859019a374ad6c';
      ct = new client.eth.Contract(typesAbi, ctInstAddress);

      done()
    })
  })

  it('types contract binary', () => {
    typesBin.should.be.a.String
  })

  it('types abi json', () => {
    typesAbi.should.be.an.Object
  })

  
  const mixString = 'mixString'
  const mixFixedUint128Array = [
  '0x' + crypto.randomBytes(16).toString('hex'),
      '0x' + crypto.randomBytes(16).toString('hex'),
      '0x' + crypto.randomBytes(16).toString('hex')
  ]
  const mixBool = false
  const mixDynamicBytes32Array  = []
  for(let i = 0, m = parseInt(Math.random() * (10 - 1) + 1); i < m; i++){    
      mixDynamicBytes32Array.push('0x' + crypto.randomBytes(32).toString('hex'))
  }

  let cases = [
    {method: 'testMix', args: [mixString, mixFixedUint128Array, mixBool, mixDynamicBytes32Array]},
    
    {method: 'testBool', args: [true]},
    {method: 'testInt8', args: [random(-2 ^ 8, 2 ^ 8 -1)]},
    {method: 'testInt16', args: [random(-2 ^ 16, 2 ^ 16 -1)]},
    {method: 'testInt24', args: [random(-2 ^ 24, 2 ^ 24 -1)]},
    {method: 'testInt32', args: [random(-2 ^ 32, 2 ^ 32 -1)]},
    {method: 'testInt40', args: [random(-2 ^ 40, 2 ^ 40 -1)]},
    {method: 'testInt48', args: [random(-2 ^ 48, 2 ^ 48 -1)]},
    {method: 'testInt56', args: [random(-2 ^ 56, 2 ^ 56 -1)]},
    {method: 'testInt64', args: [random(-2 ^ 64, 2 ^ 64 -1)]},
    {method: 'testInt72', args: [random(-2 ^ 72, 2 ^ 72 -1)]},
    {method: 'testInt80', args: [random(-2 ^ 80, 2 ^ 80 -1)]},
    {method: 'testInt88', args: [random(-2 ^ 88, 2 ^ 88 -1)]},
    {method: 'testInt96', args: [random(-2 ^ 96, 2 ^ 96 -1)]},
    {method: 'testInt104', args: [random(-2 ^ 104, 2 ^ 104 -1)]},
    {method: 'testInt112', args: [random(-2 ^ 112, 2 ^ 112 -1)]},
    {method: 'testInt120', args: [random(-2 ^ 120, 2 ^ 120 -1)]},
    {method: 'testInt128', args: [random(-2 ^ 128, 2 ^ 128 -1)]},
    
    {method: 'testUint8', args: [crypto.randomBytes(1).toString('hex')]},
    {method: 'testUint16', args: [crypto.randomBytes(2).toString('hex')]},
    {method: 'testUint24', args: [crypto.randomBytes(3).toString('hex')]},
    {method: 'testUint32', args: [crypto.randomBytes(4).toString('hex')]},
    {method: 'testUint40', args: [crypto.randomBytes(5).toString('hex')]},
    {method: 'testUint48', args: [crypto.randomBytes(6).toString('hex')]},
    {method: 'testUint56', args: [crypto.randomBytes(7).toString('hex')]},
    {method: 'testUint64', args: [crypto.randomBytes(8).toString('hex')]},
    {method: 'testUint72', args: [crypto.randomBytes(9).toString('hex')]},
    {method: 'testUint80', args: [crypto.randomBytes(10).toString('hex')]},
    {method: 'testUint88', args: [crypto.randomBytes(11).toString('hex')]},
    {method: 'testUint96', args: [crypto.randomBytes(12).toString('hex')]},
    {method: 'testUint104', args: [crypto.randomBytes(13).toString('hex')]},
    {method: 'testUint112', args: [crypto.randomBytes(14).toString('hex')]},
    {method: 'testUint120', args: [crypto.randomBytes(15).toString('hex')]},
    {method: 'testUint128', args: [crypto.randomBytes(16).toString('hex')]},

    {method: 'testAddress', args: [Web3.utils.toChecksumAddress('0x' + crypto.randomBytes(32).toString('hex')) ]},

    {method: 'testByte', args: ['0x'+crypto.randomBytes(1).toString('hex')]},
	{method: 'testFixedBytes1', args: [crypto.randomBytes(1).toString('hex')]},
	{method: 'testFixedBytes2', args: [crypto.randomBytes(2).toString('hex')]},
	{method: 'testFixedBytes3', args: [crypto.randomBytes(3).toString('hex')]},
	{method: 'testFixedBytes4', args: [crypto.randomBytes(4).toString('hex')]},
	{method: 'testFixedBytes5', args: [crypto.randomBytes(5).toString('hex')]},
	{method: 'testFixedBytes6', args: [crypto.randomBytes(6).toString('hex')]},
	{method: 'testFixedBytes7', args: [crypto.randomBytes(7).toString('hex')]},
	{method: 'testFixedBytes8', args: [crypto.randomBytes(8).toString('hex')]},
	{method: 'testFixedBytes9', args: [crypto.randomBytes(9).toString('hex')]},
	{method: 'testFixedBytes10', args: [crypto.randomBytes(10).toString('hex')]},
	{method: 'testFixedBytes11', args: [crypto.randomBytes(11).toString('hex')]},
	{method: 'testFixedBytes12', args: [crypto.randomBytes(12).toString('hex')]},
	{method: 'testFixedBytes13', args: [crypto.randomBytes(13).toString('hex')]},
	{method: 'testFixedBytes14', args: [crypto.randomBytes(14).toString('hex')]},
	{method: 'testFixedBytes15', args: [crypto.randomBytes(15).toString('hex')]},
	{method: 'testFixedBytes16', args: [crypto.randomBytes(16).toString('hex')]},
	{method: 'testFixedBytes17', args: [crypto.randomBytes(17).toString('hex')]},
	{method: 'testFixedBytes18', args: [crypto.randomBytes(18).toString('hex')]},
	{method: 'testFixedBytes19', args: [crypto.randomBytes(19).toString('hex')]},
	{method: 'testFixedBytes20', args: [crypto.randomBytes(20).toString('hex')]},
	{method: 'testFixedBytes21', args: [crypto.randomBytes(21).toString('hex')]},
	{method: 'testFixedBytes22', args: [crypto.randomBytes(22).toString('hex')]},
	{method: 'testFixedBytes23', args: [crypto.randomBytes(23).toString('hex')]},
	{method: 'testFixedBytes24', args: [crypto.randomBytes(24).toString('hex')]},
	{method: 'testFixedBytes25', args: [crypto.randomBytes(25).toString('hex')]},
	{method: 'testFixedBytes26', args: [crypto.randomBytes(26).toString('hex')]},
	{method: 'testFixedBytes27', args: [crypto.randomBytes(27).toString('hex')]},
	{method: 'testFixedBytes28', args: [crypto.randomBytes(28).toString('hex')]},
	{method: 'testFixedBytes29', args: [crypto.randomBytes(29).toString('hex')]},
	{method: 'testFixedBytes30', args: [crypto.randomBytes(30).toString('hex')]},
	{method: 'testFixedBytes31', args: [crypto.randomBytes(31).toString('hex')]},
	{method: 'testFixedBytes32', args: [crypto.randomBytes(32).toString('hex')]},
    {method: 'testFixedBytes32', args: [crypto.randomBytes(32).toString('hex')]},

    {method: 'testFixedUint16Array', args: [[65535, 0, 61680]]},

    {method: 'testFixedByteArray', args: [[
                    '0x' + crypto.randomBytes(1).toString('hex'),
                    '0x' + crypto.randomBytes(1).toString('hex'),
                    '0x' + crypto.randomBytes(1).toString('hex')
    ]]},
    {method: 'testFixedBytes1Array', args: [[
                    '0x' + crypto.randomBytes(1).toString('hex'),
                    '0x' + crypto.randomBytes(1).toString('hex'),
                    '0x' + crypto.randomBytes(1).toString('hex')
    ]]},
    {method: 'testFixedBytes15Array', args: [[
                    '0x' + crypto.randomBytes(15).toString('hex'),
                    '0x' + crypto.randomBytes(15).toString('hex'),
                    '0x' + crypto.randomBytes(15).toString('hex')
    ]]},
    {method: 'testFixedBytes16Array', args: [[
                    '0x' + crypto.randomBytes(16).toString('hex'),
                    '0x' + crypto.randomBytes(16).toString('hex'),
                    '0x' + crypto.randomBytes(16).toString('hex')
    ]]},
    {method: 'testFixedBytes32Array', args: [[
                    '0x' + crypto.randomBytes(32).toString('hex'),
                    '0x' + crypto.randomBytes(32).toString('hex'),
                    '0x' + crypto.randomBytes(32).toString('hex')
    ]]},
    {method: 'testString', args: ['hello おはようございます привет مرحبًا 여보세요 你好 hello おはようございます привет مرحبًا 여보세요 你好hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world']},
    {method: 'testBytes', args: ['0x' + crypto.randomBytes(parseInt(Math.random() * (1024 - 1) + 1)).toString('hex')]},

    {method: 'testDynamicUint8Array', args: [[240, 0, 254, 77, 1, 0, 0, 192]]},
    {method: 'testDynamicUint128Array', args: [[
      Web3.utils.hexToNumberString(crypto.randomBytes(16).toString('hex')),
      Web3.utils.hexToNumberString(crypto.randomBytes(16).toString('hex')),
      Web3.utils.hexToNumberString(crypto.randomBytes(16).toString('hex')),
      Web3.utils.hexToNumberString(crypto.randomBytes(16).toString('hex')),
      Web3.utils.hexToNumberString(crypto.randomBytes(16).toString('hex')),
    ]]},

  ]
  
  cases.forEach(({method, args}) => {
    it(method, done => {
      ct.methods[method](...args)
        .call()
        .then(res => {
          //console.log(method, "->", args, "->", res);

          if( typeof args[0] == 'number' ) {
              [res].should.eql(args.map(x => x.toString()))
          }
          done()
        })
        .catch(err => {
          console.error('error calling', method, err)
          done(err)
      })
    })
  })


  let addr1 = '0xA0C0FfEE11111111111111111111111111111111111111111111111111111111';
  let addr2 = '0xa0C0ffeE22222222222222222222222222222222222222222222222222222222';
  let addr3 = '0xA0c0ffee33333333333333333333333333333333333333333333333333333333';
  let addr4 = '0xA0c0fFEe44444444444444444444444444444444444444444444444444444444';
  let addr5 = '0xa0c0fFee55555555555555555555555555555555555555555555555555555555';

  let array1 = [ [addr1, addr2], [addr3, addr4], [addr1, addr2], [addr5, addr5] ];
  it('address[2][]', done => {
      ct.methods.superCrazy1(array1)
          .call()
          .then(res => {
              res.should.eql(array1);
              done();
          })
          .catch(err => { done(err) } );
  })

  let array2 = [ [addr1, addr2 ], [addr4, addr1 ]];
  it('address[2][2]', done => {
      ct.methods.superCrazy2(array2)
          .call()
          .then(res => {
              res.should.eql(array2);
              done();
          })
          .catch(err => { done(err) } );
  })

  let array3 = [ [addr1, addr2], [addr5, addr3] ];
  let array4 = [ [addr2, addr1], [addr4, addr4] ];
  it('address[2][2], address[2][2]', done => {
      ct.methods.superCrazy3(array3, array4)
          .call()
          .then(res => {
              res['0'].should.eql(array3);
              res['1'].should.eql(array4);
              done();
          })
          .catch(err => { done(err) } );
  })
})
