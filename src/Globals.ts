import "lib-utils-ts/src/globalUtils"
import {AbstractBitNumber} from "./AbstractBitNumber";
import {Byte, int8, uint8} from "./Byte";
import {int16, u_short, uint16, WORD} from "./Word";
import {DWORD, int32, uint32} from "./Dword";
import {int64, QWORD, u_long} from "./QWORD";
import {Float} from "./Float";
import {Double} from "./Double";
import {Char, CString, Pointer} from "./Pointer";
import {AbstractBiString} from "./AbstractBiString";
import {
    ByteArray,
    int8Array,
    WordArray,
    int16Array,
    DwordArray,
    int32Array,
    QwordArray,
    int64Array,
    FloatArray,
    DoubleArray,
    ArrayL
} from "./ArrayL";
/***
 * Enum : Bits size
 */
export enum SZB {
    /*SIZEBITS*/
    DB = 0x08,
    WD = 0x10,
    DW = 0x20,
    QW = 0x40
}
// Bits Limit
export enum LIMIT {
    /*LIMITBITS*/
    DB = 0xFF,
    WD = 0xFFFF,
    DW = 0xFFFFFFFF,
    QW = 0xFFFFFFFFFFFFFFFF
}
//Enum all types supported
export enum Types{

    VOID    = 0x00,
    BYTE    = 0x01,
    uint8   = Types.BYTE,
    char    = Types.BYTE,
    boolean = Types.BYTE,

    WORD    = 0x02,
    uint16  = Types.WORD,
    u_short = Types.WORD,

    DWORD   = 0x04,
    uint32  = Types.DWORD,

    QWORD   = 0x08,
    u_long  = Types.QWORD,

    int8    = 0x11,
    int16   = 0x12,
    int32   = 0x14,
    int64   = 0x18,

    float   = 0x24,
    double  = 0x28
}
/****
 *
 */
export interface bitNumber extends Number{
    toHex():string
    signed():boolean
    sizeOf():number
    getType():string
    endian(  ):number
}

export interface bitString extends String{
    sizeOf():number
    getType():string
}
/****
 *
 */
declare global {
    interface Array<T> {
        sum( ):number
    }
}


/****
 * Types
 */
export type BitsType = (Byte|int8|uint8|WORD|int16|uint16|u_short|DWORD|int32|uint32|QWORD|int64|u_long|Float|Double) & AbstractBitNumber
export type BitsTypeStr = (Char|Pointer<BitsType|BitsTypeStr>|CString ) & AbstractBiString
export type BitsTypeArr = (ByteArray|int8Array|WordArray|int16Array|DwordArray|int32Array|QwordArray|int64Array|FloatArray|DoubleArray) & ArrayL<BitsType>

export type s_bits = { [ index:string]:number }
export type pvoidStruct = { [ index: string]:BitsType|BitsTypeStr|s_bits|BitsTypeArr|Function };

export type LITTLE_ENDIAN   = 0x00;
export type BIG_ENDIAN      = 0x01;
export type ENDIAN          = LITTLE_ENDIAN | BIG_ENDIAN
/****
 * Extends
 */
Array.prototype.sum = function( ){
    let i:number = 0,  sum:number = 0,
        len:number = this.length;
    try{
        for(; i < len; i++ ) sum += typeof parseInt( this[ i ] ) === "number" ? parseInt( this[ i ] )  : 0;
    }catch(e){}
    return sum;
};






