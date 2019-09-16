let test_cfg = require('./_integ_test_config.js');

//console.log("Using cfg = ", test_cfg);

let should = require('should')
let Web3 = require('../')
let client = new Web3(new Web3.providers.HttpProvider(test_cfg.JAVA_IP))

describe('send raw transaction of 1.337 aions and no data', () => {
  let opts = { 
      from: "0xa0377903916a82984377554f247d49071fcfe13345f7c22da64e0c0edf18092d",//test_cfg.TEST_ACCT_ADDR,
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
    done();
  })

  

  it('sendRawTransaction', done => { 
    let tx = {
        to: '0xa08dce6e051410810782981a00ccb6bb8695304b07eb8210db2beb4745656a48',
        value: 13370000000000,  // 0.001337 Aions
        gas: 54321
    }

    client.eth.getBalance(opts.from).then((bal) => {
        if(bal < tx.value) { 
            done(Error("Account balance too low.  Want to send "+ tx.value +" but only have "+bal));
        }
    });

    //let account = client.eth.accounts.privateKeyToAccount('0x935c250733f2f100d92b7247c50ea4dda8170d311ec61034b433cc5bf946b45eeeaf880df6e5d9fad143940a079b6cc1bb3877b84eb10bdd1fa222ee266941fc');
    let account = client.eth.accounts.privateKeyToAccount(test_cfg.AVM_TEST_PK);
    account.signTransaction(tx, (err, res) => {
      if (err !== null && err !== undefined) {
        done(err);
      }

      console.log("Tx signed.  Sending to kernel.:"+res.rawTransaction);
      client.eth.sendSignedTransaction(res.rawTransaction).on('receipt', (r) => {
        let txHash = r.transactionHash;
        client.eth.getTransaction(txHash, (err, res) => {
          if (err !== null && err !== undefined) {
            done(err);
          }

          client.utils.toHex(res.value).should.eql(tx.value);
          res.from.toLowerCase().should.eql(opts.from.toLowerCase());
          res.to.toLowerCase().should.eql(tx.to.toLowerCase());
          done();
        })
      });
    })

  });

})
