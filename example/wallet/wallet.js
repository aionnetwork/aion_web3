//process.env.debug = true;

const fs = require('fs')
const Web3 = require('../../index')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
const util = require('util')

const BigNumber = require('bignumber.js')
BigNumber.config({
    ERRORS: false
})
const sol = fs.readFileSync(__dirname + '/wallet.sol', {
    encoding: 'utf8'
})

const unlock = require('../unlock.js')
const compile = require('../compile.js')

let a0 = process.argv[2], pw0 = process.argv[3],
    a1 = process.argv[4], pw1 = process.argv[5],
    a2 = process.argv[6], pw2 = process.argv[7],
    a3 = process.argv[8], pw3 = process.argv[9]

Promise.all([
    unlock(web3, a0, pw0),
    unlock(web3, a1, pw1),
    unlock(web3, a2, pw2),
    unlock(web3, a3, pw3),
    compile(web3, sol)
]).then((res) => {
    let acc0 = res[0];
    let acc1 = res[1];
    let acc2 = res[2];
    let acc3 = res[3];
    let abi = res[4].Wallet.info.abiDefinition;
    let code = res[4].Wallet.code;

    let itvl = setInterval(()=>{
      unlock(web3, acc0, pw0)
      unlock(web3, acc1, pw1)
      unlock(web3, acc2, pw2)
      unlock(web3, acc3, pw3)
    }, 30000);

    console.log('[deploying] ...');
    web3.eth.contract(abi).new(
    [
        acc1,
        acc2,
        acc3
    ],
    2, // reuired
    web3.toWei(5, 'ether'), // daily limit
    {
        from: acc0,
        data: code,
        gas: 10000000,
        gasPrice: 1
    },
    (err, contract) => {
        if(err)
            console.log('[err] ' + err)

        if (contract && contract.address) {
            console.log('[contract-address] ' + contract.address);

            let deployed = web3.eth.contract(abi).at(contract.address)

            deployed.getOwner(0, {
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, res) => {
                console.log('[owner-0] ' + res);
            })
            deployed.getOwner(1, {
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, res) => {
                console.log('[owner-1] ' + res);
            })
            deployed.getOwner(2, {
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, res) => {
                console.log('[owner-2] ' + res);
            })
            deployed.getOwner(3, {
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, res) => {
                console.log('[owner-3] ' + res);
            })
            deployed.m_required({
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, res) => {
                console.log('[m_required] ' + res);
            })
            deployed.m_dailyLimit({
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, res) => {
                console.log('[m_dailyLimit] ' + res);
            })

            deployed.allEvents({
                from: acc0,
                data: code,
                gas: 3000000,
                gasPrice: 1
            }, (err, evt) => {
                if (err)
                    console.log('[err] ' + err)
                if (evt) {
                    console.log('---------------------------------------------------------')
                    console.log('[evt] name ' + evt.event)
                    console.log('[evt] args ' + util.inspect(evt.args, null, true))
                    console.log('---------------------------------------------------------')

                    if (evt.event == 'Deposit') {
                        console.log('[deposit] ' + evt.args.value.toNumber());

                        console.log('[trying-to-call-execute] ...')
                        deployed.execute(
                            '0xb075f94677fa10743b0466b3ad1e7206816352a1bcb374d0cecf565f072d1923',
                            web3.toWei(100, 'ether'),  // TODO: adjust this parameter for single or multi-sig transactions
                            '0x', {
                                from: acc0,
                                gas: 3000000,
                                gasPrice: 1,
                            },
                            (err, res) => {
                                if (err)
                                    console.log('[err]')
                                if (res)
                                    console.log(res);
                            }
                        )
                    }

                    if (evt.event == 'ConfirmationNeeded') {
                        var operation = evt.args.operation;
                        console.log('[trying-to-confirm] ' + operation + ' from account ' + acc1)
                        deployed.confirm(
                            operation, {
                                from: acc1,
                                gas: 3000000,
                                gasPrice: 1,
                            },
                            (err, res) => {
                                if (err)
                                    console.log('[err]')
                                if (res)
                                    console.log(res);
                            }
                        );

                        console.log('[trying-to-confirm] ' + operation + ' from account ' + acc2)
                        deployed.confirm(
                            operation, {
                                from: acc2,
                                gas: 3000000,
                                gasPrice: 1,
                            },
                            (err, res) => {
                                if (err)
                                    console.log('[err]')
                                if (res)
                                    console.log(res);
                            }
                        );
                    }
                }
            })

            console.log('[transering-money-to-multisig-contract] ...')
            web3.eth.sendTransaction({
                from: acc0,
                to: contract.address,
                value: web3.toWei(10000, 'ether'),
                gas: 3000000
            }, (err, res) => {
                if (err)
                    console.log('[err] ' + err)
                if (res) {}
            })
        }
    })
})
