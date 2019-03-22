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

"use strict"; 

var utils = require('./coder-utils');
var codec = require('./coder');

class ABICoder {

    constructor() {
        if(!this) { return new Error('missing "new" keyword'); }
    }

    // Gets the right Coder based on the Param passed
    getCoder(param) {
        let comps = param.trim().split(" ").map((comp) => comp.trim());

        param = comps[0];
        let localName = comps[1] || null;

        if (param.substring(param.length - 2) === "[]") {
            return new codec.ArrayCoder(this.getCoder(param.substring(0, param.length - 2)), localName);
        }

        switch (param.toLowerCase()) {
            case "byte":
                return new codec.ByteCoder("byte", 1, 0x01, localName);
            case "short":
                return new codec.ByteCoder("short", 2, 0x04, localName);
            case "int":
                return new codec.ByteCoder("byte", 4, 0x05, localName);
            case "long":
                return new codec.ByteCoder("long", 8, 0x06, localName);

            case "boolean":
                return new codec.BooleanCoder(localName);

            case "char":
                return new codec.CharCoder(localName);

            case "string":
                return new codec.StringCoder(localName);

            case "address":
                return new codec.AddressCoder(localName);

            case "float":
                return new codec.FloatCoder("float", 4, 0x07, localName);

            case "double":
                return new codec.FloatCoder("double", 8, 0x08, localName);
        }
        throw new Error("unknown - " + param);
    }

    getReader(data) {
        return new codec.Reader(data);
    }

    getWriter() {
        return new codec.Writer();
    }

    readyDeploy(jarPath, argsData) {
        // Define the Writer for the Data and the Buffer of the jar file
        let dataWriter = this.getWriter();
        let jarBuffer = new Uint8Array(jarPath);

        // Define the Data Coder and get the Psuedo-Constructor's Arguments (Encoded) Data
        let dataCoder = new codec.ByteCoder("byte", jarBuffer.length, 0x01, "byte");
        // Use the Data Coder to Write the jar Buffer through the Data Writer
        dataCoder.encode(dataWriter, jarBuffer);

        // Create a Combined Coder, Writer, and Data of both the Psuedo-Constructor's Arguments (Encoded) 
        // Data (args), and the .jar Buffer Data (dataWriter._data)
        let combinedWriter = this.getWriter();
        let combinedLength = 4 + dataWriter._data.length + 4 + args.length;
        let combinedCoder = new codec.ByteCoder("byte", combinedLength, 0x01, "byte");
        let combinedData = utils.concat([dataWriter._data, argsData]);

        // Write the Combined Data into the Writer then Hexify it and store it to the Constructor
        combinedCoder.encode(combinedWriter, combinedData);
        return utils.hexlify(combinedWriter._data);
    }

    // Encodes Data Types and their Values which are to be used in a Method
    encode(types, values) {
        if (types.length !== values.length) {
            return new Error("types/values length mismatch");
        }

        let coders = types.map((type) => this.getCoder(type));

        let writer = this.getWriter();
        coders.forEach((coder, index) => {
            coder.encode(writer, values[index]);
        });
        return writer._data;
    }

    encodeMethod(method, types, values) {
        let sigWriter = this.getWriter();
        let methodCoder = this.getCoder("string");

        methodCoder.encode(sigWriter, method);
        return utils.hexlify(utils.concat([
            sigWriter._data,
            this.encode(types, values)
        ]));
    }

    // Decodes the AVM Contract Data based on the Data itself and the Type of Data expected
    decode(type, data) {
        let reader = this.getReader(utils.arrayify(data));
        let coder = this.getCoder(type);
        return coder.decode(reader);
    }
}

module.exports = ABICoder;