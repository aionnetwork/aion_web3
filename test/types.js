// process.env.debug = true;

const fs = require('fs')
const utils = require('../lib/utils/utils.js')
const colors = require('colors')

const Web3 = require('../index')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
const BigNumber = require('bignumber.js')
BigNumber.config({ ERRORS: false })
const sol = fs.readFileSync(__dirname + '/types.sol', {encoding: 'utf8'})

const crypto = require('crypto')
const unlock = require('./unlock')
const compile = require('./compile')
const addr = process.argv[2]
const pw = process.argv[3]
console.log('\n\n[account] ' + addr)

function random(from, to){
    return Math.floor(Math.random() * (to - from + 1)) + from
}

Promise.all([
    unlock(web3, addr, pw),
    compile(web3, sol)
]).then((res)=>{

    let acc = res[0],
        name = res[1].name,
        abi = res[1].Types.info.abiDefinition,
        code = res[1].Types.code
    const options = {from:acc, data:code, gas: 10000000, gasPrice:1}


    web3.eth.contract(abi).new(options, (err, contract)=>{
        if(err)
            console.log('[err] ' + err) 
        if(contract && contract.address){
            console.log('\n\n[new-deployed-contract-addr] ' + contract.address)

            
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

            contract.testMix(
                mixString,
                mixFixedUint128Array,
                mixBool,
                mixDynamicBytes32Array,
                { from:acc, data:code, gas: 30000000, gasPrice:100 },
                (err, ret)=>{
                    if(err)
                        console.log(('[test-mix] err ' + err).red)
                    if(
                        ret
                        && ret.length === 4
                        && ret[0] === mixString
                        && ret[1].length === 3
                        // && ret[1][0].toString(16) === mixFixedUint128Array[0]
                        // && ret[1][1].toString(16) === mixFixedUint128Array[1]
                        // && ret[1][2].toString(16) === mixFixedUint128Array[2]
                        && ret[2] === mixBool
                        && ret[3].length === mixDynamicBytes32Array.length
                        && ret[3][0] === mixDynamicBytes32Array[0]
                        && ret[3][ret[3].length - 1] === mixDynamicBytes32Array[mixDynamicBytes32Array.length - 1]
                    ){
                        console.log(('[test-mix] success').green)
                    }
                    else {
                        console.log(('[test-mix] failed ' + ret).red)
                    }
                }
            )

            contract.testBool(
                true, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bool-true] err ' + err).red)
                    if(ret === true)
                        console.log(('[test-bool-true] success').green)
                    else {
                        console.log(('[test-bool-true] failed ' + ret).red)
                    }
            })

            contract.testBool(
                false, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bool-false] err ' + err).red)
                    if(!ret)
                        console.log(('[test-bool-false] success').green)
                    else 
                        console.log(('[test-bool-false] failed ').red)
            })

            const int_8 = random(-2 ^ 8, 2 ^ 8 -1)
            contract.testInt8(
                int_8, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_8] err ' + err).red)
                    if(ret && ret.isEqualTo(int_8))
                        console.log(('[test-int_8] success').green)
                    else 
                        console.log(('[test-int_8] failed ' + int_8 + '~' + ret.toString()).red)
            })

            const int_16 = random(-2 ^ 16, 2 ^ 16 -1)
            contract.testInt16(
                int_16, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_16] err ' + err).red)
                    if(ret && ret.isEqualTo(int_16))
                        console.log(('[test-int_16] success').green)
                    else 
                        console.log(('[test-int_16] failed ' + ret).red)
            })

            const int_24 = random(-2 ^ 24, 2 ^ 24 -1)
            contract.testInt24(
                int_24, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_24] err ' + err).red)
                    if(ret && ret.isEqualTo(int_24))
                        console.log(('[test-int_24] success').green)
                    else 
                        console.log(('[test-int_24] failed ' + ret).red)
            })

            const int_32 = random(-2 ^ 32, 2 ^ 32 -1)
            contract.testInt32(
                int_32, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_32] err ' + err).red)
                    if(ret && ret.isEqualTo(int_32))
                        console.log(('[test-int_32] success').green)
                    else 
                        console.log(('[test-int_32] failed ' + ret).red)
            })

            const int_40 = random(-2 ^ 40, 2 ^ 40 -1)
            contract.testInt40(
                int_40, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_40] err ' + err).red)
                    if(ret && ret.isEqualTo(int_40))
                        console.log(('[test-int_40] success').green)
                    else 
                        console.log(('[test-int_40] failed ' + ret).red)
            }) 

            const int_48 = random(-2 ^ 48, 2 ^ 48 -1)
            contract.testInt48(
                int_48, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_48] err ' + err).red)
                    if(ret && ret.isEqualTo(int_48))
                        console.log(('[test-int_48] success').green)
                    else 
                        console.log(('[test-int_48] failed ' + ret).red)
            }) 

            const int_56 = random(-2 ^ 56, 2 ^ 56 -1)
            contract.testInt56(
                int_56, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_56] err ' + err).red)
                    if(ret && ret.isEqualTo(int_56))
                        console.log(('[test-int_56] success').green)
                    else 
                        console.log(('[test-int_56] failed ' + ret).red)
            })

            const int_64 = random(-2 ^ 64, 2 ^ 64 -1)
            contract.testInt64(
                int_64, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_64] err ' + err).red)
                    if(ret && ret.isEqualTo(int_64))
                        console.log(('[test-int_64] success').green)
                    else 
                        console.log(('[test-int_64] failed ' + ret).red)
            })

            const int_72 = random(-2 ^ 72, 2 ^ 72 -1)
            contract.testInt72(
                int_72, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_72] err ' + err).red)
                    if(ret && ret.isEqualTo(int_72))
                        console.log(('[test-int_72] success').green)
                    else 
                        console.log(('[test-int_72] failed ' + ret).red)
            })

            const int_80 = random(-2 ^ 80, 2 ^ 80 -1)
            contract.testInt80(
                int_80, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_80] err ' + err).red)
                    if(ret && ret.isEqualTo(int_80))
                        console.log(('[test-int_80] success').green)
                    else 
                        console.log(('[test-int_80] failed ' + ret).red)
            })

            const int_88 = random(-2 ^ 88, 2 ^ 88 -1)
            contract.testInt88(
                int_88, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_88] err ' + err).red)
                    if(ret && ret.isEqualTo(int_88))
                        console.log(('[test-int_88] success').green)
                    else 
                        console.log(('[test-int_88] failed ' + ret).red)
            })

            const int_96 = random(-2 ^ 96, 2 ^ 96 -1)
            contract.testInt96(
                int_96, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_96] err ' + err).red)
                    if(ret && ret.isEqualTo(int_96))
                        console.log(('[test-int_96] success').green)
                    else 
                        console.log(('[test-int_96] failed ' + ret).red)
            })

            const int_104 = random(-2 ^ 104, 2 ^ 104 -1)
            contract.testInt104(
                int_104, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_104] err ' + err).red)
                    if(ret && ret.isEqualTo(int_104))
                        console.log(('[test-int_104] success').green)
                    else 
                        console.log(('[test-int_104] failed ' + ret).red)
            })

            const int_112 = random(-2 ^ 112, 2 ^ 112 -1)
            contract.testInt112(
                int_112, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_112] err ' + err).red)
                    if(ret && ret.isEqualTo(int_112))
                        console.log(('[test-int_112] success').green)
                    else 
                        console.log(('[test-int_112] failed ' + ret).red)
            }) 

            const int_120 = random(-2 ^ 120, 2 ^ 120 -1)
            contract.testInt120(
                int_120, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_120] err ' + err).red)
                    if(ret && ret.isEqualTo(int_120))
                        console.log(('[test-int_120] success').green)
                    else 
                        console.log(('[test-int_120] failed ' + ret).red)
            })

            const int_128 = random(-2 ^ 128, 2 ^ 128 -1)
            contract.testInt128(
                int_128, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-int_128] err ' + err).red)
                    if(ret && ret.isEqualTo(int_128))
                        console.log(('[test-int_128] success').green)
                    else 
                        console.log(('[test-int_128] failed ' + ret).red)
            }) 

            const uint_8 = '0x' + crypto.randomBytes(1).toString('hex')
            contract.testUint8(
                uint_8, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_8] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_8))
                        console.log(('[test-uint_8] success').green)
                    else 
                        console.log(('[test-uint_8] failed ' + ret).red)
            })

            const uint_16 = '0x' + crypto.randomBytes(2).toString('hex')
            contract.testUint16(
                uint_16, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_16] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_16))
                        console.log(('[test-uint_16] success').green)
                    else 
                        console.log(('[test-uint_16] failed ' + ret).red)
            })

            const uint_24 = '0x' + crypto.randomBytes(3).toString('hex')
            contract.testUint24(
                uint_24, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_24] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_24))
                        console.log(('[test-uint_24] success').green)
                    else 
                        console.log(('[test-uint_24] failed ' + ret).red)
            })

            const uint_32 = '0x' + crypto.randomBytes(4).toString('hex')
            contract.testUint32(
                uint_32, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_32] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_32))
                        console.log(('[test-uint_32] success').green)
                    else 
                        console.log(('[test-uint_32] failed ' + ret).red)
            })

            const uint_40 = '0x' + crypto.randomBytes(5).toString('hex')
            contract.testUint40(
                uint_40, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_40] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_40))
                        console.log(('[test-uint_40] success').green)
                    else 
                        console.log(('[test-uint_40] failed ' + ret).red)
            })

            const uint_48 = '0x' + crypto.randomBytes(6).toString('hex')
            contract.testUint48(
                uint_48, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_48] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_48))
                        console.log(('[test-uint_48] success').green)
                    else 
                        console.log(('[test-uint_48] failed ' + ret).red)
            })

            const uint_56 = '0x' + crypto.randomBytes(7).toString('hex')
            contract.testUint56(
                uint_56, 
                { from:acc, data:code, gas: 30000, gasPrice: 100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_56] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_56))
                        console.log(('[test-uint_56] success').green)
                    else 
                        console.log(('[test-uint_56] failed ' + ret).red)
            })

            const uint_64  = '0x' + crypto.randomBytes(8).toString('hex')
            contract.testUint64(
                uint_64, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_64] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_64))
                        console.log(('[test-uint_64] success').green)
                    else 
                        console.log(('[test-uint_64] failed ' + ret).red)
            })

            const uint_72  = '0x' + crypto.randomBytes(9).toString('hex')
            contract.testUint72(
                uint_72, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_72] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_72))
                        console.log(('[test-uint_72] success').green)
                    else 
                        console.log(('[test-uint_72] failed ' + ret).red)
            })

            const uint_80  = '0x' + crypto.randomBytes(10).toString('hex')
            contract.testUint80(
                uint_80, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_80] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_80))
                        console.log(('[test-uint_80] success').green)
                    else 
                        console.log(('[test-uint_80] failed ' + ret).red)
            })

            const uint_88  = '0x' + crypto.randomBytes(11).toString('hex')
            contract.testUint88(
                uint_88, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_88] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_88))
                        console.log(('[test-uint_88] success').green)
                    else 
                        console.log(('[test-uint_88] failed ' + ret).red)
            })

            const uint_96  = '0x' + crypto.randomBytes(12).toString('hex')
            contract.testUint96(
                uint_96, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_96] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_96))
                        console.log(('[test-uint_96] success').green)
                    else 
                        console.log(('[test-uint_96] failed ' + ret).red)
            })

            const uint_104  = '0x' + crypto.randomBytes(13).toString('hex')
            contract.testUint104(
                uint_104, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_104] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_104))
                        console.log(('[test-uint_104] success').green)
                    else 
                        console.log(('[test-uint_104] failed ' + ret).red)
            })

            const uint_112  = '0x' + crypto.randomBytes(14).toString('hex')
            contract.testUint112(
                uint_112, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_112] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_112))
                        console.log(('[test-uint_112] success').green)
                    else 
                        console.log(('[test-uint_112] failed ' + ret).red)
            })

            const uint_120 = '0x' + crypto.randomBytes(15).toString('hex')
            contract.testUint120(
                uint_120, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_120] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_120))
                        console.log(('[test-uint_120] success').green)
                    else 
                        console.log(('[test-uint_120] failed ' + ret).red)
            })

            const uint_128  ='0x' + crypto.randomBytes(16).toString('hex')
            contract.testUint128(
                uint_128, 
                { from:acc, data:code, gas: 300000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint_128] err ' + err).red)
                    if(ret && ret.isEqualTo(uint_128))
                        console.log(('[test-uint_128] success').green)
                    else 
                        console.log(('[test-uint_128] failed ' + ret).red)
            })

            const address  = '0x' + crypto.randomBytes(32).toString('hex')
            contract.testAddress(
                address, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-address] err ' + err).red)
                    if(address === ret)
                        console.log(('[test-address] success').green)
                    else 
                        console.log(('[test-address] failed ' + ret).red)
            })

            const byte = '0x' + crypto.randomBytes(1).toString('hex')
            contract.testByte(
                byte, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-byte] err ' + err).red)
                    if(byte === ret)
                        console.log(('[test-byte] success').green)
                    else 
                        console.log(('[test-byte] failed ' + ret).red)
            })

            const bytes1 = '0x' + crypto.randomBytes(1).toString('hex')
            contract.testFixedBytes1(
                bytes1, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes1] err ' + err).red)
                    if(bytes1 === ret)
                        console.log(('[test-bytes1] success').green)
                    else 
                        console.log(('[test-bytes1] failed ' + ret).red)
            })

            const bytes2 = '0x' + crypto.randomBytes(2).toString('hex')
            contract.testFixedBytes2(
                bytes2, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes2] err ' + err).red)
                    if(bytes2 === ret)
                        console.log(('[test-bytes2] success').green)
                    else 
                        console.log(('[test-bytes2] failed ' + ret).red)
            })

            const bytes3 = '0x' + crypto.randomBytes(3).toString('hex')
            contract.testFixedBytes3(
                bytes3, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes3] err ' + err).red)
                    if(bytes3 === ret)
                        console.log(('[test-bytes3] success').green)
                    else 
                        console.log(('[test-bytes3] failed ' + ret).red)
            })

            const bytes4 = '0x' + crypto.randomBytes(4).toString('hex')
            contract.testFixedBytes4(
                bytes4, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes4] err ' + err).red)
                    if(bytes4 === ret)
                        console.log(('[test-bytes4] success').green)
                    else 
                        console.log(('[test-bytes4] failed ' + ret).red)
            })

            const bytes5 = '0x' + crypto.randomBytes(5).toString('hex')
            contract.testFixedBytes5(
                bytes5, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes5] err ' + err).red)
                    if(bytes5 === ret)
                        console.log(('[test-bytes5] success').green)
                    else 
                        console.log(('[test-bytes5] failed ' + ret).red)
            })

            const bytes6 = '0x' + crypto.randomBytes(6).toString('hex')
            contract.testFixedBytes6(
                bytes6, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes6] err ' + err).red)
                    if(bytes6 === ret)
                        console.log(('[test-bytes6] success').green)
                    else 
                        console.log(('[test-bytes6] failed ' + ret).red)
            })

            const bytes7 = '0x' + crypto.randomBytes(7).toString('hex')
            contract.testFixedBytes7(
                bytes7, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes7] err ' + err).red)
                    if(bytes7 === ret)
                        console.log(('[test-bytes7] success').green)
                    else 
                        console.log(('[test-bytes7] failed ' + ret).red)
            })

            const bytes8 = '0x' + crypto.randomBytes(8).toString('hex')
            contract.testFixedBytes8(
                bytes8, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes8] err ' + err).red)
                    if(bytes8 === ret)
                        console.log(('[test-bytes8] success').green)
                    else 
                        console.log(('[test-bytes8] failed ' + ret).red)
            })

            const bytes9 = '0x' + crypto.randomBytes(9).toString('hex')
            contract.testFixedBytes9(
                bytes9, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes9] err ' + err).red)
                    if(bytes9 === ret)
                        console.log(('[test-bytes9] success').green)
                    else 
                        console.log(('[test-bytes9] failed ' + ret).red)
            })

            const bytes10 = '0x' + crypto.randomBytes(10).toString('hex')
            contract.testFixedBytes10(
                bytes10, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes10] err ' + err).red)
                    if(bytes10 === ret)
                        console.log(('[test-bytes10] success').green)
                    else 
                        console.log(('[test-bytes10] failed ' + ret).red)
            })

            const bytes11 = '0x' + crypto.randomBytes(11).toString('hex')
            contract.testFixedBytes11(
                bytes11, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes11] err ' + err).red)
                    if(bytes11 === ret)
                        console.log(('[test-bytes11] success').green)
                    else 
                        console.log(('[test-bytes11] failed ' + ret).red)
            })

            const bytes12 = '0x' + crypto.randomBytes(12).toString('hex')
            contract.testFixedBytes12(
                bytes12, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes12] err ' + err).red)
                    if(bytes12 === ret)
                        console.log(('[test-bytes12] success').green)
                    else 
                        console.log(('[test-bytes12] failed ' + ret).red)
            })

            const bytes13 = '0x' + crypto.randomBytes(13).toString('hex')
            contract.testFixedBytes13(
                bytes13, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes13] err ' + err).red)
                    if(bytes13 === ret)
                        console.log(('[test-bytes13] success').green)
                    else 
                        console.log(('[test-bytes13] failed ' + ret).red)
            })

            const bytes14 = '0x' + crypto.randomBytes(14).toString('hex')
            contract.testFixedBytes14(
                bytes14, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes14] err ' + err).red)
                    if(bytes14 === ret)
                        console.log(('[test-bytes14] success').green)
                    else 
                        console.log(('[test-bytes14] failed ' + ret).red)
            })

            const bytes15 = '0x' + crypto.randomBytes(15).toString('hex')
            contract.testFixedBytes15(
                bytes15, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes15] err ' + err).red)
                    if(bytes15 === ret)
                        console.log(('[test-bytes15] success').green)
                    else 
                        console.log(('[test-bytes15] failed ' + ret).red)
            })

            const bytes16 = '0x' + crypto.randomBytes(16).toString('hex')
            contract.testFixedBytes16(
                bytes16, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes16] err ' + err).red)
                    if(bytes16 === ret)
                        console.log(('[test-bytes16] success').green)
                    else 
                        console.log(('[test-bytes16] failed ' + ret).red)
            })

            const bytes17 = '0x' + crypto.randomBytes(17).toString('hex')
            contract.testFixedBytes17(
                bytes17, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes17] err ' + err).red)
                    if(bytes17 === ret)
                        console.log(('[test-bytes17] success').green)
                    else 
                        console.log(('[test-bytes17] failed ' + ret).red)
            })

            const bytes18 = '0x' + crypto.randomBytes(18).toString('hex')
            contract.testFixedBytes18(
                bytes18, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes18] err ' + err).red)
                    if(bytes18 === ret)
                        console.log(('[test-bytes18] success').green)
                    else 
                        console.log(('[test-bytes18] failed ' + ret).red)
            })

            const bytes19 = '0x' + crypto.randomBytes(19).toString('hex')
            contract.testFixedBytes19(
                bytes19, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes19] err ' + err).red)
                    if(bytes19 === ret)
                        console.log(('[test-bytes19] success').green)
                    else 
                        console.log(('[test-bytes19] failed ' + ret).red)
            })

            const bytes20 = '0x' + crypto.randomBytes(20).toString('hex')
            contract.testFixedBytes20(
                bytes20, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes20] err ' + err).red)
                    if(bytes20 === ret)
                        console.log(('[test-bytes20] success').green)
                    else 
                        console.log(('[test-bytes20] failed ' + ret).red)
            })

            const bytes21 = '0x' + crypto.randomBytes(21).toString('hex')
            contract.testFixedBytes21(
                bytes21, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes21] err ' + err).red)
                    if(bytes21 === ret)
                        console.log(('[test-bytes21] success').green)
                    else 
                        console.log(('[test-bytes21] failed ' + ret).red)
            })

            const bytes22 = '0x' + crypto.randomBytes(22).toString('hex')
            contract.testFixedBytes22(
                bytes22, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes22] err ' + err).red)
                    if(bytes22 === ret)
                        console.log(('[test-bytes22] success').green)
                    else 
                        console.log(('[test-bytes22] failed ' + ret).red)
            })

            const bytes23 = '0x' + crypto.randomBytes(23).toString('hex')
            contract.testFixedBytes23(
                bytes23, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes23] err ' + err).red)
                    if(bytes23 === ret)
                        console.log(('[test-bytes23] success').green)
                    else 
                        console.log(('[test-bytes23] failed ' + ret).red)
            })

            const bytes24 = '0x' + crypto.randomBytes(24).toString('hex')
            contract.testFixedBytes24(
                bytes24, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes24] err ' + err).red)
                    if(bytes24 === ret)
                        console.log(('[test-bytes24] success').green)
                    else 
                        console.log(('[test-bytes24] failed ' + ret).red)
            })

            const bytes25 = '0x' + crypto.randomBytes(25).toString('hex')
            contract.testFixedBytes25(
                bytes25, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes25] err ' + err).red)
                    if(bytes25 === ret)
                        console.log(('[test-bytes25] success').green)
                    else 
                        console.log(('[test-bytes25] failed ' + ret).red)
            })

            const bytes26 = '0x' + crypto.randomBytes(26).toString('hex')
            contract.testFixedBytes26(
                bytes26, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes26] err ' + err).red)
                    if(bytes26 === ret)
                        console.log(('[test-bytes26] success').green)
                    else 
                        console.log(('[test-bytes26] failed ' + ret).red)
            })

            const bytes27 = '0x' + crypto.randomBytes(27).toString('hex')
            contract.testFixedBytes27(
                bytes27, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes27] err ' + err).red)
                    if(bytes27 === ret)
                        console.log(('[test-bytes27] success').green)
                    else 
                        console.log(('[test-bytes27] failed ' + ret).red)
            })

            const bytes28 = '0x' + crypto.randomBytes(28).toString('hex')
            contract.testFixedBytes28(
                bytes28, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes28] err ' + err).red)
                    if(bytes28 === ret)
                        console.log(('[test-bytes28] success').green)
                    else 
                        console.log(('[test-bytes28] failed ' + ret).red)
            })

            const bytes29 = '0x' + crypto.randomBytes(29).toString('hex')
            contract.testFixedBytes29(
                bytes29, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes29] err ' + err).red)
                    if(bytes29 === ret)
                        console.log(('[test-bytes29] success').green)
                    else 
                        console.log(('[test-bytes29] failed ' + ret).red)
            })

            const bytes30 = '0x' + crypto.randomBytes(30).toString('hex')
            contract.testFixedBytes30(
                bytes30, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes30] err ' + err).red)
                    if(bytes30 === ret)
                        console.log(('[test-bytes30] success').green)
                    else 
                        console.log(('[test-bytes30] failed ' + ret).red)
            })

            const bytes31 = '0x' + crypto.randomBytes(31).toString('hex')
            contract.testFixedBytes31(
                bytes31, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes31] err ' + err).red)
                    if(bytes31 === ret)
                        console.log(('[test-bytes31] success').green)
                    else 
                        console.log(('[test-bytes31] failed ' + ret).red)
            })

            const bytes32 = '0x' + crypto.randomBytes(32).toString('hex')
            contract.testFixedBytes32(
                bytes32, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes32] err ' + err).red)
                    if(bytes32 === ret)
                        console.log(('[test-bytes32] success').green)
                    else 
                        console.log(('[test-bytes32] failed ' + ret).red)
            })

            const uint16Arr = ['0xffff', '0x0000', '0xf0f0']
            contract.testFixedUint16Array(
                uint16Arr, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-uint16-arr-3] err ' + err).red)
                    if(
                        ret && 
                        ret.length === 3 && 
                        ret[0].isEqualTo(new BigNumber(uint16Arr[0])) && 
                        ret[1].isEqualTo(new BigNumber(uint16Arr[1])) && 
                        ret[2].isEqualTo(new BigNumber(uint16Arr[2]))
                    )
                        console.log(('[test-uint16-arr-3] success').green)
                    else 
                        console.log(('[test-uint16-arr-3] failed ' + ret).red)
            })

            const byteArr = [
                '0x' + crypto.randomBytes(1).toString('hex'),
                '0x' + crypto.randomBytes(1).toString('hex'),
                '0x' + crypto.randomBytes(1).toString('hex')
            ]
            contract.testFixedByteArray(
                byteArr, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-fixed-byte-arr-3] err ' + err).red)
                    if(
                        ret && 
                        ret.length === 3 &&
                        ret[0] === byteArr[0] &&
                        ret[1] === byteArr[1] &&
                        ret[2] === byteArr[2]
                    ){
                        console.log(('[test-fixed-byte-arr-3] success').green)
                    }
                    else 
                        console.log(('[test-fixed-byte-arr-3] failed ' + ret).red)
            })

            const bytes1Arr = [
                '0x' + crypto.randomBytes(1).toString('hex'),
                '0x' + crypto.randomBytes(1).toString('hex'),
                '0x' + crypto.randomBytes(1).toString('hex')
            ]
            contract.testFixedBytes1Array(
                bytes1Arr, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-fixed-bytes1-arr-3] err ' + err).red)
                    if(
                        ret && 
                        ret.length === 3 &&
                        ret[0] === bytes1Arr[0] &&
                        ret[1] === bytes1Arr[1] &&
                        ret[2] === bytes1Arr[2]
                    ){
                        console.log(('[test-fixed-bytes1-arr-3] success').green)
                    }
                    else 
                        console.log(('[test-fixed-bytes1-arr-3] failed ' + ret).red)
            })

            const bytes16Arr = [
                '0x' + crypto.randomBytes(16).toString('hex'),
                '0x' + crypto.randomBytes(16).toString('hex'),
                '0x' + crypto.randomBytes(16).toString('hex')
            ]
            contract.testFixedBytes16Array(
                bytes16Arr, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-fixed-bytes16-arr-3] err ' + err).red)
                    if(
                        ret && 
                        ret.length === 3 &&
                        ret[0] === bytes16Arr[0] &&
                        ret[1] === bytes16Arr[1] &&
                        ret[2] === bytes16Arr[2]
                    ){
                        console.log(('[test-fixed-bytes16-arr-3] success').green)
                    }
                    else 
                        console.log(('[test-fixed-bytes16-arr-3] failed ' + ret).red)
            })

            const bytes32Arr = [
                '0x' + crypto.randomBytes(32).toString('hex'),
                '0x' + crypto.randomBytes(32).toString('hex'),
                '0x' + crypto.randomBytes(32).toString('hex')
            ]
            contract.testFixedBytes32Array(
                bytes32Arr, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-fixed-bytes32-arr-3] err ' + err).red)
                    if(
                        ret && 
                        ret.length === 3 &&
                        ret[0] === bytes32Arr[0] &&
                        ret[1] === bytes32Arr[1] &&
                        ret[2] === bytes32Arr[2]
                    ){
                        console.log(('[test-fixed-bytes32-arr-3] success').green)
                    }
                    else 
                        console.log(('[test-fixed-bytes32-arr-3] failed ' + ret).red)
            })

            const strAscii  = 'hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world'           
            contract.testString(
                strAscii, 
                { from:acc, data:code, gas: 100000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-string-strAscii] err ' + err).red)
                    if(strAscii === ret)
                        console.log(('[test-string-strAscii] success').green)
                    else 
                        console.log(('[test-string-strAscii] failed "' + ret + '"').red)
            })

            const strUtf8 = 'hello おはようございます привет مرحبًا 여보세요 你好 hello おはようございます привет مرحبًا 여보세요 你好'
            contract.testString(
                strUtf8, 
                { from:acc, data:code, gas: 100000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-string-strUtf8] err ' + err).red)
                    if(strUtf8 === ret)
                        console.log(('[test-string-strUtf8] success').green)
                    else 
                        console.log(('[test-string-strUtf8] failed "' + ret + '"').red)
            })

            const strEmpty  = ''
            contract.testString(
                strEmpty, 
                { from:acc, data:code, gas: 30000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-string-strEmpty] err ' + err).red)
                    if(strEmpty === ret)
                        console.log(('[test-string-strEmpty] success').green)
                    else 
                        console.log(('[test-string-strEmpty] failed "' + ret + '"').red)
            })

            const ran = parseInt(Math.random() * (1024 - 1) + 1)
            const bytes = '0x' + crypto.randomBytes(ran).toString('hex')
            contract.testBytes(
                bytes, 
                { from:acc, data:code, gas: 100000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes] err ' + err).red)
                    if(bytes === ret)
                        console.log(('[test-bytes] success').green)
                    else 
                        console.log(('[test-bytes] failed "' + ret + '"').red)
            })

            return;
           
            const dynamicUint8Array  = []
            for(let i = 0, m = parseInt(Math.random() * (10 - 1) + 1); i < m; i++){    
                dynamicUint8Array.push('0x' + crypto.randomBytes(1).toString('hex'))
            }
            contract.testDynamicUint8Array(
                dynamicUint8Array, 
                { from:acc, data:code, gas: 3000000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-dynamic-uint8-array] err ' + err).red)
                    if(
                        ret  
                        && ret.length === dynamicUint8Array.length 
                        && ret[0].isEqualTo(new BigNumber(dynamicUint8Array[0]))
                        && ret[ret.length - 1].isEqualTo(new BigNumber(dynamicUint8Array[dynamicUint8Array.length - 1]))

                    ){
                        console.log(('[test-dynamic-uint8-array] success').green)
                    }
                    else 
                        console.log(('[test-dynamic-uint8-array] failed "' + ret + '"').red)
            })

            const dynamicUint128Array  = []
            for(let i = 0, m = parseInt(Math.random() * (10 - 1) + 1); i < m; i++){
                dynamicUint128Array.push('0x' + crypto.randomBytes(16).toString('hex'))
            }
            contract.testDynamicUint128Array(
                dynamicUint128Array, 
                { from:acc, data:code, gas: 3000000, gasPrice:100 }, 
                (err, ret)=>{ 
                    if(err)
                        console.log(('[test-bytes] err ' + err).red)
                    if(
                        ret && 
                        ret.length === dynamicUint128Array.length &&
                        ret[0].isEqualTo(new BigNumber(dynamicUint128Array[0])) &&
                        ret[ret.length - 1].isEqualTo(new BigNumber(dynamicUint128Array[dynamicUint128Array.length - 1]))
                    ){
                        console.log(('[test-bytes] success').green)
                    }
                    else 
                        console.log(('[test-bytes] failed "' + ret + '"').red)
            })
        }
    })
}, (err)=>{
    console.log('[err] ' + err)
})
