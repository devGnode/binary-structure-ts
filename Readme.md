## stream struct

<img src="https://i.ibb.co/tKdfYNv/libutilstsicon128.png" alt="lib-utils-ts" border="0" />

## Dependencies

- lib-utils-ts `>= 3.0.0-stable`

## Types

* Byte
    * Byte
    * Int8
    * Uint8
    
* Word
    * Word
    * Int16
    * Uint16
    
* Dword
    * Dword
    * Int32
    * Uint32
    * Float
 
* Qword - not really implemented

    * Qword
    * Int64
    * Double

* Character
    * Char
    * CString
    
* Pointer
    
* ArrayL
    * ByteArray
    * int8Array
    * WordArray
    * in16Array
    * DwordArray
    * int32Array
    * QwordArray
    * int64Array
    * FloatArray
    * DoubleArray
       
## PrimitiveNumber

`public class PrimitiveNumber.PrimitiveBuilder extends Number implements primitiveNumber`
    
Public readonly properties :

- MIN : min natural number
- MAX : max natural number

Override & extends :

- `isOverflow( ):boolean` : Check if number is overflow
- `signed():boolean` : return signed number flag
- `isPositive( ):boolean` : is positive number
- `sizeof():number`  : memory sizeof
- `endian( ):primitiveNumber` : reverse order of bits
- `overflowThrow( message:string ):void` : 
- `orThrow( message:string  ):primitiveNumber`
- `random( min:primitiveNumber, max:primitiveNumber):primitiveNumber` 
- `valueOf():number`
- `getType():string`
- `toHex():string`
- `toBin():string`
- `toOctal():number`
- `int2Str():string`
- `toUnsigned():primitiveNumber`
- `hasFloat():boolean`
- `newer(value:Number ):primitiveNumber`

: if radix is equal to 16, it will be returned a hex value, otherwise will be return type in string value ( binary )

Get value of a primitive type :

- `valueOf():number`

### Example

Some example basic method

##### Byte

````typescript

let byte :Byte = Byte.mk(255);
// let byte :Byte = Byte.mk(400);  throw exception overflow

console.log("out ", byte.toString() ); // ÿ
console.log("out ", byte.toInt8().valueOf() ); // -1

console.log("out ", byte.endian().valueOf() ); // 255

console.log( Byte.mk(255).toHex() ) // ff
console.log( Byte.mk(255).toBin() ) // 11111111
console.log( Byte.mk(255).toOCtal() ) // 377

console.log( Byte.mk(15).toHex(Convert.NO) ) // f
console.log( Byte.mk(255).toHex(Convert.X2) ) // f 
````
##### int8

````typescript

let byte :int8 = int8.from(-1);
// let byte :int8 = int8.mk(400);  throw exception NumericOverflow

console.log("out ", byte.toString() ); // ÿ
console.log("out ", byte.toUint8().valueOf() ); // 255

console.log("out ", byte.endian().valueOf() ); // -1

````

##### Word

````typescript

let word :Word = Word.mk( 0x1f2f );
// let word :WORD = Byte.from(65538);  throw exception NumericOverflow

console.log(word.endian().toString(16)); // 2f1f
console.log(word.endian().getType()); // Word

console.log(word.sizeOf()); // 2
console.log(word.signed()); // false

console.log("out ", word.toInt16().valueOf() ); // 7983

````

##### Int16

````typescript

let i16 :Int16 = Int16.mk( 0x1f2f );
// let word :Word = Byte.mk(65538);  throw exception NumericOverflow

console.log(i16.endian().getType()); // Int16

console.log(i16.sizeOf()); // 2
console.log(i16.signed()); // true

````

### Dword & Qword type


````typescript

let f :Float = Float.from( 0.200 );
let d :int32 = int32.from( -1102263091 );

console.log(f.toUint32()); // 0xBE4CCCCD
console.log(d.toFloat()); // 0.20000.....

console.log(f.sizeOf()); // 4
console.log(Struct.sizeOf(f)); // 4

````

Same for `Double` type

- QWORD &rarr; toDouble
- Double &rarr; toQword

### Mount Struct

````typescript

// Struct Proto
type IStruct_0 = {
    b0: Byte,
    b1: int8,
    w0: WORD,
    w1: uint16,
    dw: int32
} & pvoidStruct

// Mount ObjectStruct
let MyStruct:Function= ():IStruct_0=>{
    return {
        b0: Byte.mk(),
        b1: Int8.mk(),
        w0: Word.mk(),
        w1: Uint16.mk(),
        dw: Int32.mk()
    };
};

// Buffer
let buff:string = "\x01\xFF\x1f\x2f\x80\x80\x01\x02\x03\x04"

let struct: IStruct_0;

struct = <IStruct_0>Struct.buffer2Struct( buff, MyStruct());

console.log(struct);

````

````text
{
  b0: [Number (Byte): 1] ,
  b1: [Number (int8): -1],
  w0: [Number (WORD): 7983],
  w1: [Number (u_short): 32896],
  dw: [Number (int32): 16909060] 
}
````

Prototype of buffer2Struct

- `buffer2Struct(buffer: string, pVoidStruct: pvoidStruct, offset: number = 0, endian: ENDIAN = 0x00): pvoidStruct`


#### default value

````typescript
    console.log( MyStruct());
````

````text
{
  b0: [Number (Byte): 255] { sizeof: 1, type: 'Byte' },
  b1: [Number (int8): -1] { sizeof: 1, type: 'int8' },
  w0: [Number (WORD): 65535] { sizeof: 2, type: 'WORD' },
  w1: [Number (u_short): 65535] { sizeof: 2, type: 'u_short' },
  dw: [Number (int32): -1] { sizeof: 4, type: 'int32' }
}

````

#### memeset

- `memSet( pVoidStruct: pvoidStruct, value:Byte = Byte.from(0x00) ):pvoidStruct`

````typescript
Struct.memSet(MyStruct(),Byte.mk(0))
````

````text
{
  b0: [Number (Byte): 0] { sizeof: 1, type: 'Byte' },
  b1: [Number (int8): 0] { sizeof: 1, type: 'int8' },
  w0: [Number (WORD): 0] { sizeof: 2, type: 'WORD' },
  w1: [Number (u_short): 0] { sizeof: 2, type: 'u_short' },
  dw: [Number (int32): 0] { sizeof: 4, type: 'int32' }
}
````

### DNS Example

````ypescript
export type DNS_HEADER = {
    id      : WORD,
    flags   : s_bits|WORD,
    Qdcount : WORD,
    Ancount : WORD,
    Nscount : WORD,
    Arcount : WORD,
    query   : CString,
    type    : WORD,
    class   : WORD
} & pvoidStruct

export type DNS_NAME = {
    size    :   Byte,
    payload :   CString
} & pvoidStruct
````

````typescript

export let FS_DNS_H:Function =():DNS_HEADER=>{
    return {
        id      :   Word.mk(),
        flags   :   { a:1, fc:4, dc:1, ed:1, e:1, y:1, aa:1, ag:1, nb:1, jk:4 }, // wireshark 
        Qdcount :   Word.mk(),
        Ancount :   Word.mk(),
        Nscount :   Word.mk(),
        Arcount :   Word.mk(),
        query   :   CString.of(),
        type    :   Word.mk(),
        class   :   Word.mk()
    };
};

export let FS_DNS_NAME:Function =():DNS_NAME=>{
    return {
        size    :   Byte.from(),
        payload :   CString.from(null, Pointer.from(null,"size"))
    };
};

console.log(Struct.sizeOf(FS_DNS_H())) // 16
console.log(Struct.sizeOf(FS_DNS_NAME())) // 1

````

````typescript

function unpackName( value:string ):string{
    let out:Array<string> = [], s: DNS_NAME, offset:number =0;

     while( value[offset] ) {
        s = <DNS_NAME>Struct.buffer2Struct(value, FS_DNS_NAME(), offset);
        out.push( s.payload.valueOf() );
        offset += s.size.valueOf() + Types.BYTE;
    }

    return out.join(".");
}

unpackName( dnsStruct.query.valueOf() ) // return name of query
````