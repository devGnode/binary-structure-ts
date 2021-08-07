import {AbstractBitNumber} from "./AbstractBitNumber";
import {
    BitsType,
    BitsTypeStr,
    ENDIAN,
    primitiveNumber,
    pvoidStruct,
    s_bits,
    SZB,
    Types,
    primitiveString
} from "./Globals";
import {Byte} from "./Byte";
import {Float} from "./Float";
import { RuntimeException,IndexOfBoundException } from "lib-utils-ts/src/Exception";
import {Class} from "lib-utils-ts/src/Class";
import {Define} from "lib-utils-ts/src/Define";
import {ArrayL} from "./ArrayL";
import {PrimitiveNumber} from "./PrimitiveNumber";
import {Dword} from "./Dword";
import {Word} from "./Word";
import {Qword} from "./Qword";
import {Double} from "./Double";
import {Convert} from "./Convert";
import {PrimitiveString} from "./PrimitiveString";
import {CString} from "./Character";
/****
 * version 3.0.x
 *
 */
export class Struct{
    /****
     * @makeQword: limit of JS : 0x07FFFFFFFFFF
     * @deprecated
     */
    public static makeQword( low:number, hight:number ):number{
        return ( (Math.pow( 2, 32 ) * hight) + low );
    }
    /****
     * @memSet: Initialize a structure
     *
     * @Throwable: RuntimeException
     * @param pVoidStruct
     * @param value
     */
    public static memSet( pVoidStruct: pvoidStruct, value:Byte = Byte.mk(0x00) ):pvoidStruct{
        let key:string, pType:primitiveNumber|primitiveString|ArrayL<BitsType>|s_bits|Function,
            clss :Class<BitsType>;
        try{
            for( key in pVoidStruct ){

                pType = Object.requireNotNull(pVoidStruct[key]);
                clss = pType.getClass<BitsType>();
                if (pType instanceof PrimitiveNumber.PrimitiveNumberBuilder) pVoidStruct[key] = clss.newInstance(value.valueOf());
                if (pType instanceof PrimitiveString.PrimitiveStrBuilder ){
                    if(pType.getType().equals("CString")) pVoidStruct[key] = clss.newInstance(String.repeatString(value.toString(),pType.sizeOf()), pType.sizeOf());
                    else{
                        pVoidStruct[key] = clss.newInstance(value.toString());
                    }
                }
            }
        }catch (e) {
            throw new RuntimeException(e.stackTrace);
        }
        return pVoidStruct;
    }
    /***
     * @sizeOf: Return size of a structure
     *
     * @param pVoidStruct
     * @param deep
     * @return: number
     */
    protected static sizeOfA( pVoidStruct: pvoidStruct|s_bits|BitsType|BitsTypeStr, deep:boolean = false ):number{
        let key:string, value:BitsType|BitsTypeStr|s_bits|ArrayL<BitsType>|Function|number,
            sizeof:number = 0;

        console.log("sizeoFA ", deep)
        if(Object.isNull(pVoidStruct)) return 0;
        if( (pVoidStruct instanceof PrimitiveNumber.PrimitiveNumberBuilder)
            || (pVoidStruct instanceof PrimitiveString.PrimitiveStrBuilder) )
            return pVoidStruct.sizeOf();

        try {
            for (key in pVoidStruct) {

                value = pVoidStruct[String(key)];
                sizeof +=   typeof value === "number" && deep ? value :
                    // Type Number : BYTE, WORD, DWORD
                    (value instanceof PrimitiveNumber.PrimitiveNumberBuilder || value instanceof PrimitiveString.PrimitiveStrBuilder || value instanceof ArrayL) ? value.sizeOf() :
                     // Sub bits structure
                    typeof value === "object" && !(value instanceof PrimitiveNumber.PrimitiveNumberBuilder) && !(value instanceof PrimitiveString.PrimitiveStrBuilder) && !(value instanceof ArrayL) ?
                    Struct.sizeOfA(value, true) :
                    // SubStruct
                    value instanceof Function ? Struct.sizeOf(value.call(null)) :
                    // No Value found
                    0;
            }
        }catch (e) {
            throw new RuntimeException(e);
        }

        return deep ? ( sizeof>8? Math.round(sizeof/8) :  1) : sizeof;
    }
    /***
     *
     * @param pVoidStruct
     */
    public static sizeOf( pVoidStruct: pvoidStruct|s_bits|BitsType|BitsTypeStr ):number {
        return Struct.sizeOfA(pVoidStruct,
            typeof pVoidStruct === "object" &&
            !(pVoidStruct instanceof PrimitiveNumber.PrimitiveNumberBuilder) &&
            !(pVoidStruct instanceof PrimitiveString.PrimitiveStrBuilder) &&
            !(pVoidStruct instanceof ArrayL)
        );
    }
    /***
     * rewrite method of js code
     * @param buffer
     * @param offset
     * @param length
     */
    public static chr2int( buffer:string, offset:number, length:number ):number{
        let end = offset+length, bTmp:string ="";
        /****
         *  buffer == sizeof no need to loop
         */
        if( buffer.length.equals(length) && offset.equals(0)) {
            bTmp = buffer;
            offset=end;
        }
        for (; offset < end; offset++) bTmp += Define.of(buffer[offset]).orThrow(new IndexOfBoundException(`Buffer offset [${offset}] out of range`));
        return Convert.To.strToNumber(bTmp);
    }
    /*
     * buffer = > "Ã¿", off => 0, size => { fb:3, sb:1, tb:2, ef:2 } or
     * buffer => "oÃ¿", off => 1, size =>....
     * @return { fb:7, sb:1, tb:3, eb:3 }
     */
    public static chr2bit( buffer:string, offset:number, pStruct:s_bits ): s_bits{
        let len:number = 0, i:number = 0, rol:number = 0, key:string,
            sizeof:Array<number> = Array(), data:number;

        pStruct = pStruct || {};
        try{
            /**
             *  try to evaluate the size
             *  of bits of an elements
             */
            for( key in pStruct ){
                sizeof.push( pStruct[ key ] );
                len += pStruct[ key ];
            }
            // get buffer
            len += (len%2);
            data = Struct.chr2int(
                buffer.substr(offset, parseInt( String( len/8 ) ) == 0 ? 1 : parseInt( String(len/8) ) ),
                0x00,
                parseInt( String( len/8 ) ) == 0 ? 1 : parseInt( String(len/8) )
            );
            /***
             * Build struct
             */
            for( key in pStruct ){
                rol = sizeof
                    .slice( i+1 )
                    .sum( );
                pStruct[ key ] = ( data >> rol )&(Math.pow( 2, pStruct[ key ] )-1);
                i++;
            }
        }catch (e) {
            throw new RuntimeException(e.stackTrace);
        }
        return pStruct;
    }

    /***
     * @bit2chr:
     *  Manage 64bits but, Voila ( by slice of 32 bits ) ....
     *
     * @param pSubStruct { fb:7, sb:1, tb:3, eb:3 }
     * @param pVoiSubStruct { fb:3, sb:1, tb:2, ef:2 }
     * @return "Ã¿"
     */
    public static bit2chr( pSubStruct: s_bits, pVoiSubStruct: s_bits  ):string{
        let key:string, len:number, tLen:number = 0, n:number = 0, out:string = "";

        Object.requireNotNull(pSubStruct,"bit2chr missing pSubStruct args");
        Object.requireNotNull(pVoiSubStruct, "bit2chr missing pVoidSubStruct args");
        for( key in pVoiSubStruct ){

            Object.requireNotNull(pSubStruct[key], `Structure element not found : ${key}`);
            len = pVoiSubStruct[key];
            if( pSubStruct[key] >= 0 && pSubStruct[key] < Math.pow( 2, len ) ){

                // overflow int 32 bit QWORD not supported
                // by slice of 32bits
                if( Math.pow( 2, ( tLen += len ) ) > Math.pow( 2, SZB.DW ) ){
                    out += AbstractBitNumber.int2chr(n, Types.DWORD );
                    tLen = n = 0;
                }
                n = ( n > 0 ) ? (( n << len ) | pSubStruct[key] ) : pSubStruct[key];
            }else{
                throw new RuntimeException(`Bits structure overflow : ${key} use ${len} bit(s)`);
            }
        }
        return out + AbstractBitNumber.int2chr(n);
    }
    /***
     * @stringBuffer:
     *
     * @param buffer :is a binary buffer
     * @param pVoidStruct
     * @param pValue
     * @param offset
     */
    protected static stringBuffer(buffer:string, pVoidStruct: pvoidStruct,  pValue:BitsTypeStr, offset:number = 0  ): CString{
        let out:string = "", tmp:string, len:Define<number> = Define.of(null), nullByte:number = 0;

        // Char, CString, ...
        if( pValue instanceof PrimitiveString.PrimitiveStrBuilder ) {
            if( pValue instanceof CString && pValue.hasPointer() ){
                len = Define.of(
                    // try to find pointer of struct
                    Define.of((<primitiveNumber>pVoidStruct[ pValue.getPointer().pointerName() ]))
                        .orElseThrow(new RuntimeException(`Structure pointer [ ${pValue.getPointer().pointerName()} ] not found !`))
                        .valueOf()
                );
            }else{
                // CString with sizeof defined or
                // with no length or sizeof defined
                len = Define.of( pValue.sizeOf().equals(0)? null : pValue.sizeOf() );
            }
        }
        // Str with no length defined
        if( len.isNull() ) {
            while (buffer[offset]) {
                // Exclude NULL BYTES
                // noinspection JSDeprecatedSymbols
                if ((tmp = buffer[offset]).charCodeAt(0).equals(0) || (!len.isNullable() && offset >= len.get())) {
                    tmp.charCodeAt(0).equals(0) ? nullByte++ : void 0;
                    break;
                }
                out += tmp;
                offset++;
            }
        }else if(!len.isNull()){
            // more quick,but not real better way, no break if there is a null byte is in,
            // so some null byte can be hidden in your returned string
            out = buffer.substr(offset,len.get());
        }
        // @deprecated use DwordArray
        if( pValue instanceof CString && pValue.hasPointer()){
            // Range is equals to : 1, 2, 4, 8
            // by block, multiple of 2
            nullByte += out.length%pValue.getPointer().getRange() > 0 ? pValue.getPointer().getRange()-(out.length%pValue.getPointer().getRange()) : 0;
        }

        return CString.of( out, out.length + nullByte );
    }
    /****
     * buffer2Struct:
     * @param buffer
     * @param pVoidStruct
     * @param offset
     * @param endian
     */
    public static buffer2Struct(buffer: string, pVoidStruct: pvoidStruct, offset: number = 0, endian: ENDIAN = 0x00): pvoidStruct {
        let key: string, pType: primitiveNumber|primitiveString|ArrayL<BitsType>|s_bits|Function, pOffset: number;

        // fill struct
        for (key in pVoidStruct) {
            pType = pVoidStruct[key];

            /****
             * Primitive number
             */
            if (pType instanceof PrimitiveNumber.PrimitiveNumberBuilder) {
                let nValue: number;

                pOffset = pType.sizeOf();
                nValue = Struct.chr2int(
                    buffer,     // buffer
                    offset,     // offset
                    pOffset    // sizeOf
                );
                //
                switch ((<primitiveNumber>pType).getType()) {
                    case "Int8":    pVoidStruct[key] = Byte.mk(nValue).toInt8();    break;
                    case "Int16":   pVoidStruct[key] = Word.mk(nValue).toInt16();   break;
                    case "Int32":   pVoidStruct[key] = Dword.mk(nValue).toInt32();  break;
                    case "Int64":   throw new RuntimeException("not implemented yet"); /*pVoidStruct[key] = Qword.mk(nValue).toInt64();*/  break;
                    // float
                    case "Float":   pVoidStruct[key] = Dword.mk(nValue).toFloat();  break;
                    case "Double":  pVoidStruct[key] = Qword.mk(nValue).toDouble(); break;
                    default:
                        // otherwise unsigned number : Byte, WORD, DWORD, QWORD, ...
                        pVoidStruct[key] = pType.getClass<BitsType>().newInstance(nValue);
                }
                // Endian
                if (endian.equals(0x01) )pVoidStruct[key] = (<primitiveNumber>pVoidStruct[key]).endian();

            } else if (pType instanceof PrimitiveString.PrimitiveStrBuilder) {
                let nValue: CString;
                // STRING
                // sizeof != length
                // SIZEOF = STR + [  NULLBYTE || RANGE ]
                // LENGTH = REAL LENGTh OF STR
                nValue = Struct.stringBuffer(buffer, pVoidStruct, <BitsTypeStr>pVoidStruct[key], offset );
                pOffset = nValue.sizeOf();
                pVoidStruct[key] = pType.getClass<BitsTypeStr>().newInstance(nValue.valueOf(), pOffset);

            }else if(pType instanceof ArrayL){
                let tOff:number = offset, range:number,
                    nValue: number,len:number = tOff;

                range = pType.getRange();
                len += pOffset = pType.sizeOf();
                while( tOff < len ) {
                    nValue = Struct.chr2int(
                        buffer,     // buffer
                        tOff,       // offset
                        range       // sizeOf
                    );
                    pType.add(nValue);
                    tOff += range;
                }
            }
            // {}
            else if (typeof pType === "object") {
                pOffset = Struct.sizeOf(<s_bits>pType);
                pVoidStruct[key] = Struct.chr2bit(
                    buffer,
                    offset,
                    <s_bits>pType
                );
            }
            offset += pOffset;
        }
        return pVoidStruct;
    }

    public static struct2Buffer( pStruct: pvoidStruct, pVoidStruct: pvoidStruct = null, buffer: string = null ):Buffer{
        let bufferA:string = buffer||"", key:string,
            pType: primitiveNumber|primitiveString|ArrayL<BitsType>|Function|s_bits;

        for( key in pStruct ){

            // Number
            pType = pStruct[key];
            if( pType instanceof PrimitiveNumber.PrimitiveNumberBuilder ) bufferA += (<primitiveNumber>pType).toString();
            else if( pType instanceof PrimitiveString.PrimitiveStrBuilder ){
                let end:string = "\x00";

                // check Ptr DWORD check Len ADD ÿ ending
                if( pType instanceof CString && pType.hasPointer() ){
                    let b:number = 0;

                    if( pType.valueOf().length%pType.getPointer().getRange() > 0 ) b = pType.getPointer().getRange() - (pType.valueOf().length%pType.getPointer().getRange());
                    end += String.repeatString("ÿ",b).toString();
                }
                bufferA += pType.valueOf() + end;
            }
            else if(pType instanceof ArrayL){ console.log("Array"); pType.map(value=>bufferA+= value.toString()); }
            // Sub bits structure
            else if(typeof pType ==="object"&&!(pType instanceof Function)) bufferA += Struct.bit2chr(<s_bits>pType,<s_bits>pVoidStruct[key]);
        }

        return Buffer.from( bufferA,"binary" );
    }

}



