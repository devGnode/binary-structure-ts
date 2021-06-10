## stream struct

<img src="https://i.ibb.co/tKdfYNv/libutilstsicon128.png" alt="lib-utils-ts" border="0" />

## Dependencies

- lib-utils-ts `>= 2.0.0-stable`

## Types

* Byte
    * Bytes
    * int8
    * uint8
* Word
    * WORD
    * int16
    * u_short
* Dword
    * DWORD
    * int32
    * uint32
    * Float
* Qword
    * QWORD
    * int64
    * u_long
    * Double
    
* Pointer
    * Pointer
    * CString
    * Char
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
       
## Number

Each extended type extends of native javascript `Number` class.

Private properties :

- sizeof : siz of type in memory
- type   : type name


Override & extends :

- `toHex():string` : return string value
- `signed():boolean` : is a signed number
- `endian():number` : is a signed number
- `sizeof():number` : is a signed number
- `getType():string` : is a type name ( DWORD, WORD )
- `toString( radix?:number ):string` : if radix is equal to 16, it will be returned a hex value, otherwise will be return type in string value ( binary )

get value of type :

- `valueOf():number`

### Example

Some example basic method

##### Word

````typescript

let byte :Byte = Byte.from(255);
// let byte :Byte = Byte.from(400);  throw exception overflow

console.log("out ", byte.toString() ); // ÿ
console.log("out ", byte.toInt8().valueOf() ); // -1

console.log("out ", byte.endian().valueOf() ); // 255

````
##### int8

````typescript

let byte :int8 = int8.from(-1);
// let byte :int8 = int8.from(400);  throw exception overflow

console.log("out ", byte.toString() ); // ÿ
console.log("out ", byte.toUint8().valueOf() ); // 255

console.log("out ", byte.endian().valueOf() ); // -1

````

##### WORD

````typescript

let word :WORD = WORD.from( 0x1f2f );
// let word :WORD = Byte.from(65538);  throw exception overflow

console.log(word.Endian().toString(16)); // 2f1f
console.log(word.Endian().getType()); // WORD

console.log(word.sizeOf()); // 2
console.log(word.signed()); // false

console.log("out ", word.toInt16().valueOf() ); // 7983

````

##### int16

````typescript

let i16 :int16 = int16.from( 0x1f2f );
// let word :WORD = Byte.from(65538);  throw exception overflow

console.log(i16.instanceof(i16)); // true
console.log(i16.Endian().getType()); // int16

console.log(i16.sizeOf()); // 2
console.log(i16.signed()); // true

````

### DWORD & QWORD type

Only these both class are a method different to other else.

````typescript

let f :Float = Float.from( 0.200 );
let d :int32 = int32.from( -1102263091 );

console.log(f.toDword()); // 0xBE4CCCCD
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
    w1: u_short,
    dw: int32
} & pvoidStruct

// Mount ObjectStruct
let MyStruct:Function= ():IStruct_0=>{
    return {
        b0: Byte.from(),
        b1: int8.from(),
        w0: WORD.from(),
        w1: u_short.from(),
        dw: int32.from()
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
  b0: [Number (Byte): 1] { sizeof: 1, type: 'Byte' },
  b1: [Number (int8): -1] { sizeof: 1, type: 'int8' },
  w0: [Number (WORD): 7983] { sizeof: 2, type: 'WORD' },
  w1: [Number (u_short): 32896] { sizeof: 2, type: 'u_short' },
  dw: [Number (int32): 16909060] { sizeof: 4, type: 'int32' }
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
Struct.memSet(MyStruct(),Byte.from(0))
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
        id      :   WORD.from(),
        flags   :   { a:1, fc:4, dc:1, ed:1, e:1, y:1, aa:1, ag:1, nb:1, jk:4 }, // wireshark 
        Qdcount :   WORD.from(),
        Ancount :   WORD.from(),
        Nscount :   WORD.from(),
        Arcount :   WORD.from(),
        query   :   CString.from(),
        type    :   WORD.from(),
        class   :   WORD.from()
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