'use strict';

/*

Original document:
https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI

Updated document:
https://solidity.readthedocs.io/en/develop/abi-spec.html

Aion ABI migration guide:
https://github.com/aionnetwork/aion_fastvm/wiki/Migration-Guide

*/

var aionLib = require('aion-lib');
var errors = require('aion-web3-core-helpers').errors;
var Buffer = require('safe-buffer').Buffer;
var utils = require('./coder-utils');

var paramTypeBytes = new RegExp(/^bytes([0-9]*)$/);
var paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);
var paramTypeArray = new RegExp(/^(.*)\[([0-9]*)\]$/);

var defaultCoerceFunc = function(type, value) {
    var match = type.match(paramTypeNumber)
    if (match && parseInt(match[2]) <= 48) { return value.toNumber(); }
    return value;
}

// Shallow copy object (will move to utils/properties in v4)
function shallowCopy(object) {
    var result = {};
    for (var key in object) { result[key] = object[key]; }
    return result;
}

///////////////////////////////////
// Parsing for Solidity Signatures

var regexParen = new RegExp("^([^)(]*)\\((.*)\\)([^)(]*)$");
var regexIdentifier = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");

var close = { "(": ")", "[": "]" };

function verifyType(type) {

    // These need to be transformed to their full description
    if (type.match(/^uint($|[^1-9])/)) {
        type = 'uint128' + type.substring(4);
    } else if (type.match(/^int($|[^1-9])/)) {
        type = 'int128' + type.substring(3);
    }

    return type;
}

function parseParam(param, allowIndexed) {
    function throwError(i) {
        throw errors.UnexpectedParam(param[i], i, param);
    }

    var parent = { type: '', name: '', state: { allowType: true } };
    var node = parent;

    for (var i = 0; i < param.length; i++) {
        var c = param[i];
        switch (c) {
            case '(':
                if (!node.state.allowParams) { throwError(i); }
                delete node.state.allowType;
                node.type = verifyType(node.type);
                node.components = [ { type: '', name: '', parent: node, state: { allowType: true } } ];
                node = node.components[0];
                break;

            case ')':
                delete node.state;
                node.type = verifyType(node.type);

                var child = node;
                node = node.parent;
                if (!node) { throwError(i); }
                delete child.parent;
                delete node.state.allowParams;
                node.state.allowName = true;
                node.state.allowArray = true;
                break;

            case ',':
                delete node.state;
                node.type = verifyType(node.type);

                var sibling = { type: '', name: '', parent: node.parent, state: { allowType: true } };
                node.parent.components.push(sibling);
                delete node.parent;
                node = sibling;
                break;

            // Hit a space...
            case ' ':

                // If reading type, the type is done and may read a param or name
                if (node.state.allowType) {
                    if (node.type !== '') {
                        node.type = verifyType(node.type);
                        delete node.state.allowType;
                        node.state.allowName = true;
                        node.state.allowParams = true;
                    }
                }

                // If reading name, the name is done
                if (node.state.allowName) {
                    if (node.name !== '') {
                        if (allowIndexed && node.name === 'indexed') {
                            node.indexed = true;
                            node.name = '';
                        } else {
                            delete node.state.allowName;
                        }
                    }
                }

                break;

            case '[':
                if (!node.state.allowArray) { throwError(i); }

                //if (!node.array) { node.array = ''; }
                //node.array += c;
                node.type += c;

                delete node.state.allowArray;
                delete node.state.allowName;
                node.state.readArray = true;
                break;

            case ']':
                if (!node.state.readArray) { throwError(i); }

                //node.array += c;
                node.type += c;

                delete node.state.readArray;
                node.state.allowArray = true;
                node.state.allowName = true;
                break;

            default:
                if (node.state.allowType) {
                    node.type += c;
                    node.state.allowParams = true;
                    node.state.allowArray = true;
                } else if (node.state.allowName) {
                    node.name += c;
                    delete node.state.allowArray;
                } else if (node.state.readArray) {
                    //node.array += c;
                    node.type += c;
                } else {
                    throwError(i);
                }
        }
    }

    if (node.parent) { throw errors.UnexpectedEOF(); }

    delete parent.state;
    parent.type = verifyType(parent.type);

    //verifyType(parent);

    return parent;
}

function parseSignatureEvent(fragment) {

    var abi = {
        anonymous: false,
        inputs: [],
        type: 'event'
    }

    var match = fragment.match(regexParen);
    if (!match) { throw errors.InvalidEvent(fragment); }

    abi.name = match[1].trim();

    splitNesting(match[2]).forEach(function(param) {
        param = parseParam(param, true);
        param.indexed = !!param.indexed;
        abi.inputs.push(param);
    });

    match[3].split(' ').forEach(function(modifier) {
        switch(modifier) {
            case 'anonymous':
                abi.anonymous = true;
                break;
            case '':
                break;
            default:
                console.log('unknown modifier: ' + mdifier);
        }
    });

    if (abi.name && !abi.name.match(regexIdentifier)) {
        throw errors.InvalidIdentifier(result.name);
    }

    return abi;
}

function parseSignatureFunction(fragment) {
    var abi = {
        constant: false,
        inputs: [],
        outputs: [],
        payable: false,
        type: 'function'
    };

    var comps = fragment.split(' returns ');
    var left = comps[0].match(regexParen);
    if (!left) { throw errors.InvalidSignature(); }

    abi.name = left[1].trim();
    if (!abi.name.match(regexIdentifier)) {
        throw errors.InvalidIdentifier(left[1]);
    }

    splitNesting(left[2]).forEach(function(param) {
        abi.inputs.push(parseParam(param));
    });

    left[3].split(' ').forEach(function(modifier) {
        switch (modifier) {
            case 'constant':
                abi.constant = true;
                break;
            case 'payable':
                abi.payable = true;
                break;
            case 'pure':
                abi.constant = true;
                abi.stateMutability = 'pure';
                break;
            case 'view':
                abi.constant = true;
                abi.stateMutability = 'view';
                break;
            case '':
                break;
            default:
                console.log('unknown modifier: ' + modifier);
        }
    });

    // We have outputs
    if (comps.length > 1) {
        var right = comps[1].match(regexParen);
        if (right[1].trim() != '' || right[3].trim() != '') {
            throw errors.UnexpectedTokens();
        }

        splitNesting(right[2]).forEach(function(param) {
            abi.outputs.push(parseParam(param));
        });
    }

    return abi;
}


function parseSignature(fragment) {
    if(typeof(fragment) === 'string') {
        // Make sure the "returns" is surrounded by a space and all whitespace is exactly one space
        fragment = fragment.replace(/\(/g, ' (').replace(/\)/g, ') ').replace(/\s+/g, ' ');
        fragment = fragment.trim();

        if (fragment.substring(0, 6) === 'event ') {
           return parseSignatureEvent(fragment.substring(6).trim());

        } else {
            if (fragment.substring(0, 9) === 'function ') {
                fragment = fragment.substring(9);
            }
            return parseSignatureFunction(fragment.trim());
        }
    }

    throw errors.UnknownFragment();
}


///////////////////////////////////
// Coders

var coderNull = function(coerceFunc) {
    return {
        name: 'null',
        type: '',
        encode: function(value) {
            return utils.arrayify([]);
        },
        decode: function(data, offset) {
            if (offset > data.length) { throw errors.InvalidCoderValue('null'); } 
            return {
                consumed: 0,
                value: coerceFunc('null', undefined)
            }
        },
        dynamic: false
    };
}

var coderNumber = function(coerceFunc, size, signed, localName) {
    var name = ((signed ? 'int': 'uint') + (size * 8));
    return {
        localName: localName,
        name: name,
        type: name,
        encode: function(value) {
            try {
                value = utils.bigNumberify(value)
            } catch (error) {
                throw error;
            }
            value = value.toTwos(size * 8).maskn(size * 8);

            if (signed) {
                value = value.fromTwos(size * 8).toTwos(128);
            }

            return utils.padZeros(utils.arrayify(value), 16);
        },
        decode: function(data, offset) {
            if (data.length < offset + 16) {
                throw errors.InsufficientData(name);
            }
            var junkLength = 16 - size;
            var sliced = data.slice(offset + junkLength, offset + 16)
            var value = utils.bigNumberify(sliced);

            if (signed) {
                value = value.fromTwos(size * 8);
            } else {
                value = value.maskn(size * 8);
            }

            return {
                consumed: 16,
                value: coerceFunc(name, value),
            }
        }
    };
}

var uint128Coder = coderNumber(function(type, value) { return value; }, 16, false);

var coderBoolean = function(coerceFunc, localName) {
    return {
        localName: localName,
        name: 'bool',
        type: 'bool',
        encode: function(value) {
           return uint128Coder.encode(!!value ? 1: 0);
        },
        decode: function(data, offset) {
            try {
                var result = uint128Coder.decode(data, offset);
            } catch (error) {
                throw error;
            }
            return {
                consumed: result.consumed,
                value: coerceFunc('boolean', !result.value.isZero())
            }
        }
    }
}

var coderFixedBytes = function(coerceFunc, length, localName) {
    var name = ('bytes' + length);
    var minLen = (length <= 16 ? 16 : 32);
    return {
        localName: localName,
        name: name,
        type: name,
        encode: function(value) {
            try {
                value = utils.arrayify(value);

                // @TODO: In next major change, the value.length MUST equal the
                // length, but that is a backward-incompatible change, so here
                // we just check for things that can cause problems.
                if (value.length > 32) {
                    throw errors.ExcessiveBytes('field bytes');
                }

            } catch (error) {
                throw error;
            }

            if (value.length === minLen)  { return value; }

            var result = Buffer.alloc(minLen);
            result.set(value);
            return result;
        },
        decode: function(data, offset) {
            if (data.length < offset + minLen) {
                throw errors.InsufficientData(name);
            }

            return {
                consumed: minLen,
                value: coerceFunc(name, utils.hexlify(data.slice(offset, offset + length)))
            }
        }
    };
}

var coderAddress = function(coerceFunc, localName) {
    return {
        localName: localName,
        name: 'address',
        type: 'address',
        encode: function(value) {
            try {
                value = utils.arrayify(utils.getAddress(value));
            } catch (error) {
                throw errors.InvalidCoderValue('address');
            }
            var result = Buffer.from(value);
            return result;
        },
        decode: function(data, offset) {
            if (data.length < offset + 32) {
                throw errors.InsufficientData('address');
            }
            return {
                consumed: 32,
                value: coerceFunc('address', utils.getAddress(utils.hexlify(data.slice(offset, offset + 32))))
           }
        }
    }
}

function _encodeDynamicBytes(value) {
    var dataLength = parseInt(32 * Math.ceil(value.length / 32));
    var padding = Buffer.alloc(dataLength - value.length);

    return utils.concat([
        uint128Coder.encode(value.length),
        value,
        padding
    ]);
}

function _decodeDynamicBytes(data, offset, localName) {
    if (data.length < offset + 16) {
        throw errors.InsufficientData('dynamicBytes');
    }

    var length = uint128Coder.decode(data, offset).value;
    offset += 16

    try {
        length = length.toNumber();
    } catch (error) {
        throw errors.ExcessiveBytes('dynamicBytes');
    }

    if (data.length < offset + length) {
        throw errors.InsufficientData('dynamicBytes');
    }


    return {
        consumed: parseInt(32 * Math.ceil(length / 32)),
        value: data.slice(offset, offset + length),
    }
}

var coderDynamicBytes = function(coerceFunc, localName) {
    return {
        localName: localName,
        name: 'bytes',
        type: 'bytes',
        encode: function(value) {
            try {
                value = utils.arrayify(value);
            } catch (error) {
                throw errors.InvalidCoderValue('bytes');
            }
            return _encodeDynamicBytes(value);
        },
        decode: function(data, offset) {
            var result = _decodeDynamicBytes(data, offset, localName);
            result.value = coerceFunc('bytes', utils.hexlify(result.value));
            return result;
        },
        dynamic: true
    };
}

var coderString = function(coerceFunc, localName) {
    return {
        localName: localName,
        name: 'string',
        type: 'string',
        encode: function(value) {
            if (typeof(value) !== 'string') {
                throw errors.InvalidCoderValue('string');
            }
            return _encodeDynamicBytes(utils.toUtf8Bytes(value));
        },
        decode: function(data, offset) {
            var result = _decodeDynamicBytes(data, offset, localName);
            result.value = coerceFunc('string', utils.toUtf8String(result.value));
            return result;
        },
        dynamic: true
    };
}

function alignSize(size) {
    return parseInt(16 * Math.ceil(size / 16));
}

function pack(coders, values) {

    if (Array.isArray(values)) {
       // do nothing

    } else if (values && typeof(values) === 'object') {
        var arrayValues = [];
        coders.forEach(function(coder) {
            arrayValues.push(values[coder.localName]);
        });
        values = arrayValues;

    } else {
        throw new Error('invalid tuple value');
        throw errors.InvalidCoderValue('tuple');
    }

    if (coders.length !== values.length) {
        throw errors.LengthMismatch('Types/Value');
    }

    var parts = [];

    coders.forEach(function(coder, index) {
        parts.push({ dynamic: coder.dynamic, value: coder.encode(values[index]) });
    });

    var staticSize = 0, dynamicSize = 0;
    parts.forEach(function(part, index) {
        if (part.dynamic) {
            staticSize += 16;
            dynamicSize += alignSize(part.value.length);
        } else {
            staticSize += alignSize(part.value.length);
        }
    });

    var offset = 0, dynamicOffset = staticSize;
    var data = Buffer.alloc(staticSize + dynamicSize);

    parts.forEach(function(part, index) {
        if (part.dynamic) {
            //uint128Coder.encode(dynamicOffset).copy(data, offset);
            data.set(uint128Coder.encode(dynamicOffset), offset);
            offset += 16;

            //part.value.copy(data, dynamicOffset);  @TODO
            data.set(part.value, dynamicOffset);
            dynamicOffset += alignSize(part.value.length);
        } else {
            //part.value.copy(data, offset);  @TODO
            data.set(part.value, offset);
            offset += alignSize(part.value.length);
        }
    });

    return data;
}

function unpack(coders, data, offset) {
    var baseOffset = offset;
    var consumed = 0;
    var value = [];
    coders.forEach(function(coder) {
        if (coder.dynamic) {
            var dynamicOffset = uint128Coder.decode(data, offset);
            var result = coder.decode(data, baseOffset + dynamicOffset.value.toNumber());
            // The dynamic part is leap-frogged somewhere else; doesn't count towards size
            result.consumed = dynamicOffset.consumed;
        } else {
            var result = coder.decode(data, offset);
        }

        if (result.value != undefined) {
            value.push(result.value);
        }

        offset += result.consumed;
        consumed += result.consumed;
    });

    coders.forEach(function(coder, index) {
        var name = coder.localName;
        if (!name) { return; }

        if (typeof(name) === 'object') { name = name.name; }
        if (!name) { return; }

        if (name === 'length') { name = '_length'; }

        if (value[name] != null) { return; }

        value[name] = value[index];
    });

    return {
        value: value,
        consumed: consumed
    }

    return result;
}

function coderArray(coerceFunc, coder, length, localName) {
    var type = (coder.type + '[' + (length >= 0 ? length: '') + ']');

    return {
        coder: coder,
        localName: localName,
        length: length,
        name: 'array',
        type: type,
        encode: function(value) {
            if (!Array.isArray(value)) {
                throw errors.InvalidCoderValue('array'); 
            }

            var count = length;

            var result = Buffer.alloc(0); // buffer null

            if (count === -1) {
                count = value.length;
                result = uint128Coder.encode(count);
            }

            if (count !== value.length) {
                throw errors.LengthMismatch('Array value');
            }

            var coders = [];
            value.forEach(function(value) { coders.push(coder); });

            return utils.concat([result, pack(coders, value)]);
        },
        decode: function(data, offset) {
            // @TODO:
            //if (data.length < offset + length * 32) { throw new Error('invalid array'); }

            var consumed = 0;
            var count = length;

            if (count === -1) {
                 try {
                      var decodedLength = uint128Coder.decode(data, offset);
                 } catch (error) {
                     throw errors.InsufficientData('dynamic array');
                 }
                 try {
                     count = decodedLength.value.toNumber();
                 } catch (error) {
                     throw errors.ExcessiveBytes('Array');
                 }
                 consumed += decodedLength.consumed;
                 offset += decodedLength.consumed;
            }

            // We don't want the children to have a localName
            var subCoder = {
                name: coder.name,
                type: coder.type,
                encode: coder.encode,
                decode: coder.decode,
                dynamic: coder.dynamic
            };

            var coders = [];
            for (var i = 0; i < count; i++) { coders.push(subCoder); }

            var result = unpack(coders, data, offset);
            result.consumed += consumed;
            result.value = coerceFunc(type, result.value);
            return result;
        },
        dynamic: (length === -1 || coder.dynamic)
    }
}


function coderTuple(coerceFunc, coders, localName) {

    var dynamic = false;
    var types = [];
    coders.forEach(function(coder) {
        if (coder.dynamic) { dynamic = true; }
        types.push(coder.type);
    });

    var type = ('tuple(' + types.join(',') + ')');

    return {
        coders: coders,
        localName: localName,
        name: 'tuple',
        type: type,
        encode: function(value) {
            return pack(coders, value);
        },
        decode: function(data, offset) {
            var result = unpack(coders, data, offset);
            result.value = coerceFunc(type, result.value);
            return result;
        },
        dynamic: dynamic
    };
}
/*
function getTypes(coders) {
    var type = coderTuple(coders).type;
    return type.substring(6, type.length - 1);
}
*/
function splitNesting(value) {
    var result = [];
    var accum = '';
    var depth = 0;
    for (var offset = 0; offset < value.length; offset++) {
        var c = value[offset];
        if (c === ',' && depth === 0) {
            result.push(accum);
            accum = '';
        } else {
            accum += c;
            if (c === '(') {
                depth++;
            } else if (c === ')') {
                depth--;
                if (depth === -1) {
                    throw errors.UnbalanceParenthesis();
                }
            }
        }
    }
    result.push(accum);

    return result;
}

var paramTypeSimple = {
    address: coderAddress,
    bool: coderBoolean,
    string: coderString,
    bytes: coderDynamicBytes,
};

function getTupleParamCoder(coerceFunc, components, localName) {
    if (!components) { components = []; }
    var coders = [];
    components.forEach(function(component) {
        coders.push(getParamCoder(coerceFunc, component));
    });

    return coderTuple(coerceFunc, coders, localName);
}

function getParamCoder(coerceFunc, param) {
    var coder = paramTypeSimple[param.type];
    if (coder) { return coder(coerceFunc, param.name); }

    var match = param.type.match(paramTypeNumber);
    if (match) {
        var size = parseInt(match[2] || 128);
        if (size === 0 || size > 128 || (size % 8) !== 0) {
            throw errors.InvalidBitLength(match[1]);
        }
        return coderNumber(coerceFunc, size / 8, (match[1] === 'int'), param.name);
    }

    var match = param.type.match(paramTypeBytes);
    if (match) {
        var size = parseInt(match[1]);
        if (size === 0 || size > 32) {
            throw errors.InvalidBytesLength();
        }
        return coderFixedBytes(coerceFunc, size, param.name);
    }

    var match = param.type.match(paramTypeArray);
    if (match) {
        param = shallowCopy(param);
        var size = parseInt(match[2] || -1);
        param.type = match[1];
        return coderArray(coerceFunc, getParamCoder(coerceFunc, param), size, param.name);
    }

    if (param.type.substring(0, 5) === 'tuple') {
        return getTupleParamCoder(coerceFunc, param.components, param.name);
    }

    if (type === '') {
        return coderNull(coerceFunc);
    }

    throw errors.InvalidType();
}

function Coder(coerceFunc) {
    if (!(this instanceof Coder)) { throw new Error('missing new'); }
    if (!coerceFunc) { coerceFunc = defaultCoerceFunc; }
    utils.defineProperty(this, 'coerceFunc', coerceFunc);
}

// Legacy name support
// @TODO: In the next major version, remove names from decode/encode and don't do this
function populateNames(type, name) {
    if (!name) { return; }

    if (type.type.substring(0, 5) === 'tuple' && typeof(name) !== 'string') {
        if (type.components.length != name.names.length) {
            throw errors.LengthMismatch('Names/Types');
        }

        name.names.forEach(function(name, index) {
            populateNames(type.components[index], name);
        });

        name = (name.name || '');
    }

    if (!type.name && typeof(name) === 'string') {
        type.name = name;
    }
}

utils.defineProperty(Coder.prototype, 'encode', function(names, types, values) {

    // Names is optional, so shift over all the parameters if not provided
    if (arguments.length < 3) {
        values = types;
        types = names;
        names = [];
    }

    if (types.length !== values.length) {
        throw errors.LengthMismatch('Types/Values');
    }

    var coders = [];
    types.forEach(function(type, index) {
        // Convert types to type objects
        //   - "uint foo" => { type: "uint", name: "foo" }
        //   - "tuple(uint, uint)" => { type: "tuple", components: [ { type: "uint" }, { type: "uint" }, ] }
        if (typeof(type) === 'string') {
            type = parseParam(type);
        }

        // Legacy support for passing in names (this is going away in the next major version)
        populateNames(type, names[index]);
        var coder = getParamCoder(this.coerceFunc, type);
        coders.push(coder);
    }, this);

    var preOp = coderTuple(this.coerceFunc, coders).encode(values)

    var op = utils.hexlify(preOp)

    return op;
});

utils.defineProperty(Coder.prototype, 'decode', function(names, types, data) {

    // Names is optional, so shift over all the parameters if not provided
    if (arguments.length < 3) {
        data = types;
        types = names;
        names = [];
    }

    data = utils.arrayify(data);

    var coders = [];
    types.forEach(function(type, index) {

        // See encode for details
        if (typeof(type) === 'string') {
            type = parseParam(type);
        }

        // Legacy; going away in the next major version
        populateNames(type, names[index]);

        coders.push(getParamCoder(this.coerceFunc, type));
    }, this);

    return coderTuple(this.coerceFunc, coders).decode(data, 0).value;

});

utils.defineProperty(Coder, 'defaultCoder', new Coder());

utils.defineProperty(Coder, 'parseSignature', parseSignature);


module.exports = Coder
