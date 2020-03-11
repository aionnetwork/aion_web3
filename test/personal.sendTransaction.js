var testMethod = require('./helpers/test.method.js');

var method = 'sendTransaction';

var accounts = require('./fixtures/accounts')
var address = accounts[0].address;
var checksumAddress = accounts[0].checksumAddress;
var privateKey = accounts[0].privateKey;


var tests = [{
    args: [{
        from: address, // checksum address
        to: address, // checksum address
        value: '1234567654321',
        gasPrice: '324234234234'
    }, 'SomePass@Word!'],
    formattedArgs: [{
        from: address,
        to: address,
        value: "0x11f71f76bb1",
        gasPrice: '0x4b7dddc97a'
    }, 'SomePass@Word!'],
    result: '0xfff12345678976543213456786543212345675432',
    formattedResult: '0xfff12345678976543213456786543212345675432',
    // notification: {
    //     method: 'eth_subscription',
    //     params: {
    //         subscription: '0x1234567',
    //         result: '0x9ce59a13059e417087c02d3236a0b1cc'
    //     }
    // },
    call: 'personal_'+ method
},{
    args: [{
        from: address,
        to: address,
        value: '1234567654321',
        data: '0x213453ffffff',
        gasPrice: '324234234234'
    }, 'SomePass@Word!'],
    formattedArgs: [{
        from: address,
        to: address,
        value: "0x11f71f76bb1",
        data: '0x213453ffffff',
        gasPrice: '0x4b7dddc97a'
    }, 'SomePass@Word!'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    // notification: {
    //     method: 'eth_subscription',
    //     params: {
    //         subscription: '0x1234567',
    //         result: '0x9ce59a13059e417087c02d3236a0b1cc'
    //     }
    // },
    call: 'personal_'+ method
},{
    error: true, // only for testing
    args: [{
        from: 'XE81ETHXREGGAVOFYORK', // iban address
        to: address,
        value: '1234567654321'
    }, 'SomePass@Word!'],
    call: 'personal_'+ method
}];

testMethod.runTests(['eth','personal'], method, tests);

