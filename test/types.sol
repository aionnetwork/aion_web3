pragma solidity ^0.4.0;

contract Types {

    function testMix(string a, uint128[3] b, bool c, bytes32[] d) 
    constant returns (string, uint128[3], bool, bytes32[]){
        return (a,b,c,d);
    }

    function testBool(bool x) constant returns (bool) { return x; }  

    function testInt8(int8 x) constant returns (int8) { return x; }  

    function testInt16(int16 x) constant returns (int16) { return x; }  

    function testInt24(int24 x) constant returns (int24) { return x; }  

    function testInt32(int32 x) constant returns (int32) { return x; }  

    function testInt40(int40 x) constant returns (int40) { return x; }  

    function testInt48(int48 x) constant returns (int48) { return x; }  

    function testInt56(int56 x) constant returns (int56) { return x; }  

    function testInt64(int64 x) constant returns (int64) { return x; }  

    function testInt72(int72 x) constant returns (int72) { return x; }   

    function testInt80(int80 x) constant returns (int80) { return x; }  

    function testInt88(int88 x) constant returns (int88) { return x; }  

    function testInt96(int96 x) constant returns (int96) { return x; }  

    function testInt104(int104 x) constant returns (int104) { return x; }

    function testInt112(int112 x) constant returns (int112) { return x; }

    function testInt120(int120 x) constant returns (int120) { return x; }

    function testInt128(int128 x) constant returns (int128) { return x; } 

    function testInt(int x) constant returns (int) { return x; }  

    function testUint8(uint8 x) constant returns (uint8) { return x; }  

    function testUint16(uint16 x) constant returns (uint16) { return x; }  

    function testUint24(uint24 x) constant returns (uint24) { return x; }  

    function testUint32(uint32 x) constant returns (uint32) { return x; }  

    function testUint40(uint40 x) constant returns (uint40) { return x; }  

    function testUint48(uint48 x) constant returns (uint48) { return x; }  

    function testUint56(uint56 x) constant returns (uint56) { return x; }  

    function testUint64(uint64 x) constant returns (uint64) { return x; }  

    function testUint72(uint72 x) constant returns (uint72) { return x; }  

    function testUint80(uint80 x) constant returns (uint80) { return x; }  

    function testUint88(uint88 x) constant returns (uint88) { return x; }  

    function testUint96(uint96 x) constant returns (uint96) { return x; }  

    function testUint104(uint104 x) constant returns (uint104) { return x; }  

    function testUint112(uint112 x) constant returns (uint112) { return x; }  

    function testUint120(uint120 x) constant returns (uint120) { return x; }  

    function testUint128(uint128 x) constant returns (uint128) { return x; } 

    function testUint(uint x) constant returns (uint) { return x; }  

    function testAddress(address x) constant returns (address) { return x; }  

    // fixed

    function testByte(byte x) constant returns (byte) { return x; }  

    function testFixedBytes1(bytes1 x) constant returns (bytes1) { return x; }  

    function testFixedBytes2(bytes2 x) constant returns (bytes2) { return x; }  

    function testFixedBytes3(bytes3 x) constant returns (bytes3) { return x; }  

    function testFixedBytes4(bytes4 x) constant returns (bytes4) { return x; }  

    function testFixedBytes5(bytes5 x) constant returns (bytes5) { return x; }  

    function testFixedBytes6(bytes6 x) constant returns (bytes6) { return x; }  

    function testFixedBytes7(bytes7 x) constant returns (bytes7) { return x; }  

    function testFixedBytes8(bytes8 x) constant returns (bytes8) { return x; }  

    function testFixedBytes9(bytes9 x) constant returns (bytes9) { return x; }  

    function testFixedBytes10(bytes10 x) constant returns (bytes10) { return x; }  

    function testFixedBytes11(bytes11 x) constant returns (bytes11) { return x; }  

    function testFixedBytes12(bytes12 x) constant returns (bytes12) { return x; }  

    function testFixedBytes13(bytes13 x) constant returns (bytes13) { return x; }  

    function testFixedBytes14(bytes14 x) constant returns (bytes14) { return x; }  

    function testFixedBytes15(bytes15 x) constant returns (bytes15) { return x; }  

    function testFixedBytes16(bytes16 x) constant returns (bytes16) { return x; }  

    function testFixedBytes17(bytes17 x) constant returns (bytes17) { return x; }  

    function testFixedBytes18(bytes18 x) constant returns (bytes18) { return x; }  

    function testFixedBytes19(bytes19 x) constant returns (bytes19) { return x; }  

    function testFixedBytes20(bytes20 x) constant returns (bytes20) { return x; }  

    function testFixedBytes21(bytes21 x) constant returns (bytes21) { return x; }  

    function testFixedBytes22(bytes22 x) constant returns (bytes22) { return x; }  

    function testFixedBytes23(bytes23 x) constant returns (bytes23) { return x; }  

    function testFixedBytes24(bytes24 x) constant returns (bytes24) { return x; }  

    function testFixedBytes25(bytes25 x) constant returns (bytes25) { return x; }  

    function testFixedBytes26(bytes26 x) constant returns (bytes26) { return x; }  

    function testFixedBytes27(bytes27 x) constant returns (bytes27) { return x; }  

    function testFixedBytes28(bytes28 x) constant returns (bytes28) { return x; }  

    function testFixedBytes29(bytes29 x) constant returns (bytes29) { return x; }  

    function testFixedBytes30(bytes30 x) constant returns (bytes30) { return x; }  

    function testFixedBytes31(bytes31 x) constant returns (bytes31) { return x; }  

    function testFixedBytes32(bytes32 x) constant returns (bytes32) { return x; }  

    function testFixedUint16Array(uint16[3] x) constant returns (uint16[3]) { return x; }  

    function testFixedUint32Array(uint32[3] x) constant returns (uint32[3]) { return x; }  

    function testFixedUint64Array(uint64[3] x) constant returns (uint64[3]) { return x; }  

    function testFixedUint96Array(uint96[3] x) constant returns (uint96[3]) { return x; }  

    function testFixedUint128Array(uint128[3] x) constant returns (uint128[3]) { return x; }  

    function testFixedByteArray(byte[3] x) constant returns (byte[3]) { return x; }  

    function testFixedBytes1Array(bytes1[3] x) constant returns (bytes1[3]) { return x; }  

    function testFixedBytes15Array(bytes15[3] x) constant returns (bytes15[3]) { return x; }  

    function testFixedBytes16Array(bytes16[3] x) constant returns (bytes16[3]) { return x; }  

    function testFixedBytes32Array(bytes32[3] x) constant returns (bytes32[3]) { return x; }  

    // dynamic

    function testString(string x) constant returns (string) { return x; }  

    function testBytes(bytes x) constant returns (bytes) { return x; }  

    function testDynamicUint8Array(uint8[] x) constant returns (uint8[]) { return x; }  

    function testDynamicUint128Array(uint128[] x) constant returns (uint128[]) { return x; }  

    function testDynamicByteArray(byte[] x) constant returns (byte[]) { return x; }  

    function testDynamicBytes1Array(bytes1[] x) constant returns (bytes1[]) { return x; }  

    function testDynamicBytes15Array(bytes15[] x) constant returns (bytes15[]) { return x; }  

    function testDynamicBytes16Array(bytes16[] x) constant returns (bytes16[]) { return x; }  

    function testDynamicBytes32Array(bytes32[] x) constant returns (bytes32[]) { return x; }  

}