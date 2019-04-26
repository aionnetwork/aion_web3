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

    // The Byte Length of the Data
    getLength() { 
        return this._data.length; 
    }

    writeByte(value) {
        return this.writeBytes([ value ]);
    }

    // Writes the bytes-representation of the data for encoders
    writeBytes(bytes) {
        this._data = utils.concat([ this._data, bytes ]);
        return utils.arrayify(bytes).length;
    }

    // Specificially used for writing Strings to ensure they do not exceed 64kb by
    // shifting the binary representation 16 bits to the right and masking it for 
    // a total length of 64kb
    writeLength(length) {
        if (length > 0xffff) { throw new Error("length out of bounds"); }
        return this.writeBytes([ (length >> 16), (length & 0xff) ]);
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

    // Reads the byte-representation of the data used by decoders
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

// Used for Data Types to enable them to Read/Write, Decode/Encode, as needed. 
// By default, all classes which inherit this will have a Decode and Encode method 
// which firsts confirms the tag passed in as being valid before performing their
// unique conversions, depending on the class. Ex: the ByteCoder converts anything
// with 6 bytes or less into a number through the BigNumber package. This works as 
// well with the CharCoder for the same reason.
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

// Used for Int, Short, Long, Byte, Boolean, and Char Data Types
class ByteCoder extends Coder {
    constructor(type, byteCount, tag, localName) {
        super(type, tag, localName);
        this.byteCount = byteCount;
    }

    // As each byte is 8 bits, this takes a reader and it's data to decode 
    // its bytes through the BigNumber module
    decode(reader, array) {
        if(array === null) {
            let tag = reader.readByte();
            if (tag !== this.tag) { 
                this._throwError("invalid tag"); 
            }
        }
        let value = utils.bigNumberify(reader.readBytes(this.byteCount)).fromTwos(this.byteCount * 8);
        return value.toNumber();
    }

    // Writes Bytes through a writer by first writing the tag in binary
    // first, which would in theory be writing the length of the data
    // first before then writing the actual bytes. This follows the
    // structure of endian-encoding through this means
    encode(writer, value, array) {
        if (value == null) { 
            this._throwError("cannot be null"); 
        }

        let bytes = utils.padZeros(utils.arrayify(utils.bigNumberify(value).toTwos(this.byteCount * 8)), this.byteCount);
        if(array === null) writer.writeByte(this.tag);
        writer.writeBytes(bytes);
    }
}

// Used for Boolean Data Types
class BooleanCoder extends ByteCoder {
    constructor(type, tag, localName) {
        super(type, 1, tag, localName);
    }

    // Converts the decoded value to a boolean value 
    // through double-negation
    decode(reader, array) {
        return !!super.decode(reader, array);
    }

    // Basically checks the value being passed in
    // first as being either false (0x00) or true (0x01)
    // and then passing in the binary representation of it
    encode(writer, value, array) {
        super.encode(writer, (!value) ? 0x00: 0x01, array);
    }
}

// Used for handling char Data Types
class CharCoder extends ByteCoder {
    constructor(type, tag, localName) {
        super(type, 2, tag, localName);
    }

    // Overrides the ByteCoder's decode method 
    // to read the char from ASCII after decoding
    decode(reader, array) {
        return String.fromCharCode(super.decode(reader, array));
    }

    // Overrides the ByteCoder's encode method
    // to write the char to ASCII before encoding.
    // Also, it ensures that the value being encoded
    // is only 1 character long as JavaScript is not
    // a strongly typed language; ergo, value is a string
    encode(writer, value, array) {
        if (value.length !== 1) { throw new Error("char must be 1 char long"); }
        super.encode(writer, value.charCodeAt(0), array);
    }
}

// Used to handle float and double Data Types
class FloatCoder extends Coder {
    constructor(type, byteCount, tag, localName) {
        super(type, tag, localName);
        this.byteCount = byteCount;
    }

    // Overides for the sake of building a DataView to get 
    // the float representation of the decoded result as
    // JavaScript is not a strongly typed language
    decode(reader, array) {
        if(array === null) {
            let tag = reader.readByte();
            if (tag !== this.tag) { 
                throw new Error("invalid tag"); 
            }
        }

        let view = new DataView(reader.readBytes(this.byteCount).buffer);
        if (this.byteCount === 4) {
            return view.getFloat32(0);
        }
        return view.getFloat64(0);
    }

    // Floats are generated when the byteCount is 4 
    // (32 bits; hence, setFloat32) while Doubles are 
    // generated when the byteCount is 8 (64 bits; hence, //
    // setFloat64)
    encode(writer, value, array) {
        if(array === null) writer.writeByte(this.tag);

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

    // Used specifically for decoding null values
    decodeNull(reader) {
        let tag = reader.readByte()
        if (tag !== this.tag) { throw new Error("invalid null type"); }
        return null;
    }

    // Determines whether to write the value as null or otherwise
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
        super("address", 0x22, localName);
    }

    // Uses a utils specific method to confirm the value read is an Address format
    decodeValue(reader) {
        return utils.getAddress(utils.hexlify(reader.readBytes(32)));
    }

    // Uses a utils specific method to ensure the value written is an Address format
    encodeValue(writer, value) {
        utils.getAddress(value);
        writer.writeBytes(value);
    }
}

// Handling of String Data Type
class StringCoder extends NullableCoder {
    constructor(localName) {
        super("String", 0x21, localName);
    }

    // Reads the length of the string first before then takes
    // the read output and converting it to a UTF8 String
    decodeValue(reader) {
        let length = reader.readLength();
        return utils.toUtf8String(reader.readBytes(length));
    }

    // Converts the UTF8 String to bytes, then writes the 
    // length of the bytes followed by the bytes themselves
    encodeValue(writer, value) {
        let bytes = utils.toUtf8Bytes(value);
        writer.writeLength(bytes.length);
        writer.writeBytes(bytes);
    }

}

// Handling of byte arrays (byte[])
// Note: After finding a TagNull, the next byte will be 
// primitive array tag and needs to be read
class ByteArrayCoder extends ByteCoder {
    constructor(type, byteCount, tag, localName) {
        super(type, byteCount, tag, localName);
    }

    decode(reader) {
        let tag = reader.readByte();
        if(tag === TagNull) {
            reader.readByte();
            return null;
        } else if (tag !== this.tag) {
            throw new Error("invalid child tag"); 
        }
        let length = reader.readLength();
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(super.decode(reader));
        }
        return result;
    }

    encode(writer, value) {
        if(!Array.isArray(value)) {
            this._throwError("has to be an array");
        }

        writer.writeByte(this.tag);
        writer.writeLength(value.length);
        value.forEach((value) => {
            super.encode(writer, value, true);
        });
    }
}

// Handling of boolean arrays (boolean[])
// Note: After finding a TagNull, the next byte will be 
// primitive array tag and needs to be read
class BooleanArrayCoder extends BooleanCoder {
    constructor(type, tag, localName) {
        super(type, tag, localName);
    }

    decode(reader) {
        let tag = reader.readByte();
        if(tag === TagNull) {
            reader.readByte();
            return null;
        } else if (tag !== this.tag) {
            throw new Error("invalid child tag"); 
        }
        let length = reader.readLength();
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(super.decode(reader));
        }
        return result;
    }

    encode(writer, value) {
        if(!Array.isArray(value)) {
            this._throwError("has to be an array");
        }

        writer.writeByte(this.tag);
        writer.writeLength(value.length);
        value.forEach((value) => {
            super.encode(writer, value, true);
        });
    }
}

// Used for handling char arrays (char[])
// Note: After finding a TagNull, the next byte will be 
// primitive array tag and needs to be read
class CharArrayCoder extends CharCoder {
    constructor(type, tag, localName) {
        super(type, tag, localName);
    }

    decode(reader) {
        let tag = reader.readByte();
        if(tag === TagNull) {
            reader.readByte();
            return null;
        } else if (tag !== this.tag) {
            throw new Error("invalid child tag"); 
        }
        let length = reader.readLength();
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(super.decode(reader));
        }
        return result;
    }

    encode(writer, value) {
        if(!Array.isArray(value)) {
            this._throwError("has to be an array");
        }

        writer.writeByte(this.tag);
        writer.writeLength(value.length);
        value.forEach((value) => {
            super.encode(writer, value, true);
        });
    }
}

// Used to handle float and double arrays (float[] and double[])
// Note: After finding a TagNull, the next byte will be 
// primitive array tag and needs to be read
class FloatArrayCoder extends FloatCoder {
    constructor(type, byteCount, tag, localName) {
        super(type, byteCount, tag, localName);
    }

    decode(reader) {
        let tag = reader.readByte();
        if(tag === TagNull) {
            reader.readByte();
            return null;
        } else if (tag !== this.tag) {
            throw new Error("invalid child tag"); 
        }
        let length = reader.readLength();
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(super.decode(reader));
        }
        return result;
    }

    encode(writer, value) {
        if(!Array.isArray(value)) {
            this._throwError("has to be an array");
        }

        writer.writeByte(this.tag);
        writer.writeLength(value.length);
        value.forEach((value) => {
            super.encode(writer, value, true);
        });
    }
}

// Handling of the string, address, and 2 dimensional (2D)
// Arrays (string[], address[], and int[][], byte[][], etc)
// Note: Only primitives (not string and address) can 
// be 2D Arrays, by first putting the outer-most array
// as this type, and then the inner-most arrays as the
// aforementioned array-types based on the primitive 
// ( ArrayCoder[ByteArrayCoder, ByteArrayCoder] )
class ArrayCoder extends NullableCoder {
    constructor(coder, localName) {
        super(coder.type + "[]", 0x31, localName);
        this.coder = coder;
    }

    decodeNull(reader) {
        let tag = reader.readByte();
        if (tag !== this.tag) { 
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
        writer.writeLength(value.length); 
        value.forEach((value) => {
            if(value == null) {
                writer.writeBytes([ TagNull, this.coder.tag ]);
            } else {
                this.coder.encode(writer, value);
            }
        });
    }
}

module.exports = {
    Reader: Reader,
    Writer: Writer,

    Coder: Coder,
    
    ByteCoder: ByteCoder,
    CharCoder: CharCoder,
    ArrayCoder: ArrayCoder,
    FloatCoder: FloatCoder,
    StringCoder: StringCoder,
    BooleanCoder: BooleanCoder,
    AddressCoder: AddressCoder,
    NullableCoder: NullableCoder,

    ByteArrayCoder: ByteArrayCoder,
    CharArrayCoder: CharArrayCoder,
    FloatArrayCoder: FloatArrayCoder,
    BooleanArrayCoder: BooleanArrayCoder
}