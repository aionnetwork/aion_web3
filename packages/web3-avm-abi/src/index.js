/*
 * Copyright (c) 2017-2018 Aion foundation.
 *
 *     This file is part of the aion network project.
 *
 *     The aion network project is free software: you can redistribute it 
 *     and/or modify it under the terms of the GNU General Public License 
 *     as published by the Free Software Foundation, either version 3 of 
 *     the License, or any later version.
 *
 *     The aion network project is distributed in the hope that it will 
 *     be useful, but WITHOUT ANY WARRANTY; without even the implied 
 *     warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *     See the GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the aion network project source files.  
 *     If not, see <https://www.gnu.org/licenses/>.
 *
 * Contributors:
 *     Aion foundation.
 */
/**
* 
* @Module Avm-abi
*
*/

"use strict"; 
var _ = require('underscore');
let utils = require('./coder-utils');
let codec = require('./coder');
let ABI = require('./interface');
class ABICoder {

    constructor() {
        if(!this) { return new Error('missing "new" keyword'); }
        this.coder_utils = utils;
    }

    // Gets the right Coder based on the Param passed
    getCoder(param) {
       let comps = param.trim().split(" ").map((comp) => comp.trim());

        param = comps[0];
        let localName = comps[1] || null;
        // Checks for a 2D Array and if so, builds the inner-most coder 
        // for the arrays on the inside

        if(param.substring(param.length - 4) === "[][]") {
            let coder = param.substring(0, param.length - 2);
            
            if(!coder.includes("string") && !coder.includes("address")) {
                return new codec.ArrayCoder(this.getCoder(coder), localName);
            }
        } 

        // Switch statement to find all the different types of coders
        switch (param.toLowerCase()) {
            case "byte":
                return new codec.ByteCoder("byte", 1, 0x01, localName);
            case "boolean":
                return new codec.BooleanCoder("boolean", 0x02, localName);
            case "char":
                return new codec.CharCoder("char", 0x03, localName);
            case "short":
                return new codec.ByteCoder("short", 2, 0x04, localName);
            case "int":
                return new codec.ByteCoder("int", 4, 0x05, localName);
            case "long":
                return new codec.ByteCoder("long", 8, 0x06, localName);
            case "float":
                return new codec.FloatCoder("float", 4, 0x07, localName);
            case "double":
                return new codec.FloatCoder("double", 8, 0x08, localName);

            case "string":
                return new codec.StringCoder(localName);
            case "address":
                return new codec.AddressCoder(localName);
            case "Address":
                return new codec.AddressCoder(localName);

            case "byte[]": 
                return new codec.ByteArrayCoder("byte[]", 1, 0x11, localName);
            case "boolean[]": 
                return new codec.BooleanArrayCoder("boolean[]", 0x12, localName);
            case "char[]":
                return new codec.CharArrayCoder("char[]", 0x13, localName);
            case "short[]":
                return new codec.ByteArrayCoder("short[]", 2, 0x14, localName);
            case "int[]": 
                return new codec.ByteArrayCoder("int[]", 4, 0x15, localName);
            case "long[]":
                return new codec.ByteArrayCoder("long[]", 8, 0x16, localName);
            case "float[]":
                return new codec.FloatArrayCoder("float[]", 4, 0x17, localName);
            case "double[]":
                return new codec.FloatArrayCoder("double[]", 8, 0x18, localName);

            case "string[]":
                return new codec.ArrayCoder(new codec.StringCoder("string"), localName);
            case "address[]":
                return new codec.ArrayCoder(new codec.AddressCoder("address"), localName);
            
            //implimentation for BigInt
            case "biginteger":
                return new codec.BigIntegerCoder("biginteger", null, 0x23, localName);
            case "biginteger[]":
                return new codec.BigIntegerArrayCoder("biginteger[]", null, 0x31, localName);    
        }
        throw new Error("unknown - " + param);
    }

    // Creates a new Instance of a Reader
    getReader(data) {
        return new codec.Reader(data);
    }

    // Creates a new Instance of a Writer
    getWriter() {
        return new codec.Writer();
    }

    readyDeploy(jarPath, encodedArgs) {
        // Converts the jarfile into Bytes
        let jarArrayBuffer = new Uint8Array(jarPath);

        // Get the byte length of the Jar and the encoded data arguments
        let codeLength = jarArrayBuffer.byteLength;
        let argsLength = encodedArgs.length;

        // Create a stream which will handle the big endian encoding of the jar file
        var combinedBinary = new Uint8Array(4 + codeLength + 4 + argsLength);
        var combinedStream = new utils.endianEncoding(combinedBinary);

        combinedStream.writeFour(codeLength);
        combinedStream.writeBytes(jarArrayBuffer, codeLength);
        combinedStream.writeFour(argsLength);
        combinedStream.writeBytes(encodedArgs, argsLength);

        return utils.hexlify(combinedBinary);
    }

    // Encodes Data Types and their Values which are to be used in a Method
    encode(types, values) {
        
        if (types.length !== values.length) {
            return new Error("types/values length mismatch");
        }

        let coders = types.map((type) => this.getCoder(type));
        let writer = this.getWriter();
        coders.forEach((coder, index) => {
            let array = null;
            if(coder.type.substring(coder.type.length - 2) === "[]") {
                array = true;
            }
            coder.encode(writer, values[index], array);
        });
        return writer._data;
    }

    // Encodes Specifically for a Method Call
    encodeMethod(method, types, values) {
        let sigWriter = this.getWriter();
        let methodCoder = this.getCoder("string");

        methodCoder.encode(sigWriter, method, null);
        return utils.hexlify(utils.concat([
            sigWriter._data,
            this.encode(types, values)
        ]));
    }

    // Decodes the AVM Contract Data based on the Data itself and the Type of Data expected
    decode(type, data) {
        let reader = this.getReader(utils.arrayify(data));
        let coder = this.getCoder(type);

        var array = null;
        if(type.substring(type.length - 2) === "[]") array = true;
        return coder.decode(reader, array);
    }

    //
    AvmInterface(abi){
        return ABI.Interface.fromString(abi);
    }

    /**
     * Decodes events non- and indexed parameters.
     *
     * @method getEvents
     * @param {Object} inputs
     * @param {String} data
     * @param {Array} topics
     * @return {Array} byte array
     */
     getEvents(inputs, data, topics) {
        var _this = this;
        topics = _.isArray(topics) ? topics : [topics];

        data = data || '';

        var notIndexedInputs = [];
        var indexedParams = [];
        var topicCount = 0;

        // TODO check for anonymous logs?

        inputs.forEach(function (input, i) {
            if (input.indexed) {
                indexedParams[i] = (['bool', 'int', 'uint', 'address', 'fixed', 'ufixed'].find(function (staticType) {
                    return input.type.indexOf(staticType) !== -1;
                })) ? _this.decodeParameter(input.type, topics[topicCount]) : topics[topicCount];
                topicCount++;
            } else {
                notIndexedInputs[i] = input;
            }
        });


        var nonIndexedData = data;
        var notIndexedParams = (nonIndexedData) ? this.decodeParameters(notIndexedInputs, nonIndexedData) : [];

        var returnValue = new Result();
        returnValue.__length__ = 0;


        inputs.forEach(function (res, i) {
            returnValue[i] = (res.type === 'string') ? '' : null;

            if (typeof notIndexedParams[i] !== 'undefined') {
                returnValue[i] = notIndexedParams[i];
            }
            if (typeof indexedParams[i] !== 'undefined') {
                returnValue[i] = indexedParams[i];
            }

            if (res.name) {
                returnValue[res.name] = returnValue[i];
            }

            returnValue.__length__++;
        });

        return returnValue;
    };
}

module.exports = ABICoder;