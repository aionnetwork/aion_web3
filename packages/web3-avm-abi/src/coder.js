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

"use strict"

var utils = require('./coder-utils.js');

const TagNull = 0x32;

// Used for Encoding Data Types and their Arguments for AVM Contracts
class Writer {

    constructor() {
        this._data = utils.arrayify([ ]);
    }

    getData() { 
        return utils.hexlify(this._data); 
    }

    getLength() { 
        return this._data.length; 
    }

    writeByte(value) {
        return this.writeBytes([ value ]);
    }

    writeBytes(bytes) {
        this._data = utils.concat([ this._data, bytes ]);
        return utils.arrayify(bytes).length;
    }

    writeLength(length, checkMaxLength) {
        if(checkMaxLength === true) {
            if (length > 0xffff) { throw new Error("length out of bounds"); }
            return this.writeBytes([ (length >> 16), (length & 0xff) ]);
        } else {
            return this.writeBytes([ length ]);
        }
    }
}

// Used for Decoding Data Types and their Arguments for AVM Contracts
class Reader {
    constructor(data) {
        utils.defineProperty(this, "_data", utils.arrayify(data));
        this._offset = 0;
    }

    getConsumed() { 
        return this._offset; 
    }

    readByte() {
        return this.readBytes(1)[0];
    }

    readBytes(count) {
        let value = this._data.slice(this._offset, this._offset + count);
        if (value.length !== count) { throw new Error("out-of-bounds"); }
        this._offset += count;
        return new Uint8Array(value);
    }

    readLength() {
        let bytes = this.readBytes(2);
        return (bytes[0] << 8) | bytes[1];
    }
}

// Used for Data Types to enable them to Read/Write, Decode/Encode, as needed
class Coder {

    // The coder byte pattern tag

    // The fully expanded type, including composite types:
    //   - address, short[][], etc.

    // The localName bound in the signature, in this example it is "baz":
    //   - byte[] baz

    constructor(type, tag, localName) {
        this.type = type;
        this.tag = tag;
        this.localName = localName;
    }

    _throwError(message) {
        return new Error(message);
    }
}

class ByteCoder extends Coder {
    constructor(type, byteCount, tag, localName) {
        super(type, tag, localName);
        this.byteCount = byteCount;
    }

    decode(reader) {
        let tag = reader.readByte();
        if (tag !== this.tag) { this._throwError("invalid tag"); }
        let value = utils.bigNumberify(reader.readBytes(this.byteCount)).fromTwos(this.byteCount * 8);
        if(this.type <= 6) { 
            return value.toNumber(); 
        }
        return value;
    }

    encode(writer, value) {
        if (value == null) { 
            this._throwError("cannot be null"); 
        }

        let bytes = utils.padZeros(utils.arrayify(utils.bigNumberify(value).toTwos(this.byteCount * 8)), this.byteCount);
        writer.writeByte(this.tag);
        writer.writeBytes(bytes);
    }
}

class BooleanCoder extends ByteCoder {
    constructor(localName) {
        super("boolean", 1, 0x02, localName);
    }

    decode(reader) {
        return !!super.decode(reader);
    }

    encode(writer, value) {
        super.encode(writer, (!value) ? 0x00: 0x01);
    }
}

class CharCoder extends ByteCoder {
    constructor(localName) {
        super("char", 2, 0x03, localName);
    }

    decode(reader) {
        return String.fromCharCode(super.decode(reader));
    }

    encode(writer, value) {
        if (value.length !== 1) { throw new Error("char must be 1 char long"); }
        super.encode(writer, value.charCodeAt(0));
    }
}

class FloatCoder extends Coder {
    constructor(type, byteCount, tag, localName) {
        super(type, tag, localName);
        this.byteCount = byteCount;
    }

    decode(reader) {
        let tag = reader.readByte();
        if (tag !== this.tag) { 
            throw new Error("invalid tag"); 
        }

        let view = new DataView(reader.readBytes(this.byteCount).buffer);
        if (this.byteCount === 4) {
            return view.getFloat32(0);
        }
        return view.getFloat64(0);
    }

    encode(writer, value) {
        writer.writeByte(this.tag);

        let buffer = new ArrayBuffer(this.byteCount);
        let view = new DataView(buffer);
        if (this.byteCount === 4) {
            view.setFloat32(0, value);
        } else {
            view.setFloat64(0, value);
        }
        writer.writeBytes(new Uint8Array(buffer, 0, this.byteCount));
    }
}

// Specifically for Data Types that can be Null
class NullableCoder extends Coder {
    decode(reader) {
        let byte = reader.readByte();
        if (byte === TagNull) {
            return this.decodeNull(reader);
        }
        if (byte !== this.tag) { throw new Error("invalid type"); }
        return this.decodeValue(reader);
    }

    decodeNull(reader) {
        let tag = reader.readByte()
        if (tag !== this.tag) { throw new Error("invalid null type"); }
        return null;
    }

    encode(writer, value) {
        if (value == null) {
            writer.writeBytes([ TagNull, this.tag ]);
        } else {
            writer.writeByte(this.tag);
            this.encodeValue(writer, value);
        }
    }
}

// Handling of the Address Data Type which is ultimately a String
class AddressCoder extends NullableCoder {
    constructor(localName) {
        super("address", 0x03, localName);
    }

    decodeValue(reader) {
        return utils.getAddress(utils.hexlify(reader.readBytes(32)));
    }

    encodeValue(writer, value) {
        utils.getAddress(value);
        writer.writeBytes(value);
    }
}

class StringCoder extends NullableCoder {
    constructor(localName) {
        super("String", 0x21, localName);
    }

    decodeValue(reader) {
        let length = reader.readLength();
        return utils.toUtf8String(reader.readBytes(length));
    }

    encodeValue(writer, value) {
        let bytes = utils.toUtf8Bytes(value);
        writer.writeLength(bytes.length, true);
        writer.writeBytes(bytes);
    }

}

// Handling of the Arrays
class ArrayCoder extends NullableCoder {
    constructor(coder, localName) {
        super(coder.type + "[]", 0x31, localName);
        this.coder = coder;
    }

    decodeNull(reader) {
        let tag = reader.readByte();
        if (tag !== this.coder.tag) { 
            throw new Error("invalid child tag"); 
        }
        return null;
    }

    decodeValue(reader) {
        let tag = reader.readByte();
        if (tag !== this.coder.tag) {
            throw new Error("invalid child tag"); 
        }

        let length = reader.readLength();
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(this.coder.decode(reader));
        }
        return result;
    }

    encodeValue(writer, value) {
        writer.writeByte(this.coder.tag);
        writer.writeLength(value.length, true);
        value.forEach((value) => {
            this.coder.encode(writer, value);
        });
    }
}

module.exports = {
    Reader: Reader,
    Writer: Writer,

    Coder: Coder,
    
    ByteCoder: ByteCoder,
    CharCoder: CharCoder,
    FloatCoder: FloatCoder,
    StringCoder: StringCoder,
    BooleanCoder: BooleanCoder,
    AddressCoder: AddressCoder,
    NullableCoder: NullableCoder
}