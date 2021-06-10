import {AbstractBitNumber} from "./AbstractBitNumber";
import {AbstractBiString} from "./AbstractBiString";
import {BitsType, BitsTypeStr, ENDIAN, pvoidStruct, s_bits, SZB, Types} from "./Globals";
import {Byte, int8} from "./Byte";
import {int16, WORD} from "./Word";
import {DWORD, int32} from "./DWord";
import {Float} from "./Float";
import {Double} from "./Double";
import {QWORD} from "./QWORD";
import {CString, Pointer} from "./Pointer";
import { RuntimeException,IndexOfBoundException } from "lib-utils-ts/src/Exception";
import { Class } from "lib-utils-ts/src/Class";
import { Define } from "lib-utils-ts/src/Define";
import {ArrayL} from "./ArrayL";
/****
 * version 3.0.x
 *
 */
export class Struct{


    public static makeQword( low:number, hight:number ):number{
        return ( (Math.pow( 2, 32 ) * hight) + low );
    }

    public static memSet( pVoidStruct: pvoidStruct, value:Byte = Byte.from(0x00) ):pvoidStruct{
        let key:string, pType:AbstractBitNumber|AbstractBiString|ArrayL<BitsType>|s_bits|Function,
            clss :Class<BitsType>;
        try{
            for( key in pVoidStruct ){
                pType = pVoidStruct[key];
                clss = pType.getClass();
                if (pType instanceof AbstractBitNumber) pVoidStruct[key] = clss.newInstance(value.valueOf());
                if (pType instanceof AbstractBiString ){
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
     * sizeOf: return size of a structure
     * @param pVoidStruct
     * @param deep
     */
    public static sizeOf( pVoidStruct: pvoidStruct|s_bits|BitsType|BitsTypeStr, deep:boolean = false ):number{
        let key:string, value:BitsType|BitsTypeStr|s_bits|ArrayL<BitsType>|Function|number,
            sizeof:number = 0;

        if(Define.of(pVoidStruct).isNullable()) return 0;
        if( (pVoidStruct instanceof AbstractBitNumber) || (pVoidStruct instanceof AbstractBiString) ) return pVoidStruct.sizeOf();
        try {
            for (key in pVoidStruct) {

                value = pVoidStruct[String(key)];
                sizeof +=   typeof value === "number" && deep ? value :
                            // Type Number : Byte, WORD, DWORD
                            (value instanceof AbstractBitNumber || value instanceof AbstractBiString || value instanceof ArrayL) ? value.sizeOf() :
                            // Sub bits structure
                            typeof value === "object" && !(value instanceof AbstractBitNumber) && !(value instanceof AbstractBiString) && !(value instanceof ArrayL) ?
                            Struct.sizeOf(value, true) :
                            // SubStruct
                            value instanceof Function ? Struct.sizeOf(value.call(null)) :
                            // No Value found
                            0;
            }
        }catch (e) {
            throw new RuntimeException(e.stackTrace);
        }

        return deep ? ( sizeof>8? Math.round(sizeof/8) :  1) : sizeof;
    }
    /***
     * rewrite method of js code
     * @param buffer
     * @param offset
     * @param length
     * @param endian
     * @param type
     */
    public static chr2int( buffer:string, offset:number, length:number, endian:ENDIAN ):number{
        let rol	   = length*8, ret:number = 0, signed:number = 0,
            end	   = offset+(length&0x0f),
            // bit64
            b64    = 0;

        signed = (length&0x10) >> 4;
        // -- 64 bits
        // cut of [ high, low ]
        if( (length&0x0f) > Types.DWORD ){
            rol/=2;
            end/=2;
            b64 =1;
        }
        //console.log(rol, "OKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
        for (; offset < end; offset++) {

            Define.of<string>(buffer[offset]).orThrow(new IndexOfBoundException(`Buffer offset [${offset}] out of range`))
            buffer[offset] ?
                // review ret |= method
                (ret += (1 << (rol -= 8)) * buffer.charCodeAt(offset))
                // nop
                : 0;
           /// console.log("CALC=>>> ",ret, rol,(1 << (rol )),"buffer charcide at : ", buffer.charCodeAt(offset), Buffer.from(buffer[offset]).readUInt8(), buffer[offset]);
        }
        if( b64){
            console.log("vbs")
            let dw:DWORD = DWORD.from(ret);

            /*****
             * todo: check number returned by dw.Endian() if > 0
             * Js use 32 bits bitwise may be use method Math.pow
             * for endian abstract method
             */
            if(endian) dw.Endian();
            dw = dw.valueOf() < 0 ?  DWORD.from(parseInt( dw.toHex(), 16)):dw;
            ret = Struct.makeQword(
                Struct.chr2int(buffer,offset+4, Types.DWORD, 0), // LOW
                dw.valueOf() // High
            );
        }
        if( ret > 4294967298 ) console.log(ret, "OKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
        return ret;
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
            // look for size of
            // bit element
            for( key in pStruct ){
                sizeof.push( pStruct[ key ] );
                len += pStruct[ key ];
            }

            // get buffer
            len += (len%2);
            data = Struct.chr2int(
                buffer.substr(offset, parseInt( String( len/8 ) ) == 0 ? 1 : parseInt( String(len/8) ) ),
                0x00,
                parseInt( String( len/8 ) ) == 0 ? 1 : parseInt( String(len/8) ),
                0x00
            );

            // parse
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

            Object.requireNotNull(pSubStruct[key], `Element ${key} not found in your struct`);
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
        if( pValue instanceof AbstractBiString) {
            if( pValue instanceof CString && pValue.hasPtr() ){
                len = Define.of(
                    Define
                        .of((<AbstractBitNumber>pVoidStruct[ pValue.getPtr().pointerName() ]))
                        .orElseThrow(new RuntimeException(`Structure pointer [ ${pValue.getPtr().pointerName()} ] not found !`))
                        .valueOf()
                );
            }else
            len = Define.of( pValue.sizeOf().equals(0)? null : pValue.sizeOf() );
        }

        // Str with no length defined
        if( len.isNullable() ) {

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
        }else if(!len.isNullable()){
            // more quick,but not real better way, no break if there is a null byte is in,
            // so some null byte can be hidden in your returned string
            out = buffer.substr(offset,len.get());
        }

        if( pValue instanceof CString && pValue.hasPtr()){
            // Range is equals to : 1, 2, 4, 8
            // by block, multiple of 2
           nullByte += out.length%pValue.getPtr().getRange() > 0 ? pValue.getPtr().getRange()-(out.length%pValue.getPtr().getRange()) : 0;
        }

        return CString.from( out, out.length + nullByte );
    }
    /****
     * buffer2Struct:
     * @param buffer
     * @param pVoidStruct
     * @param offset
     * @param endian
     */
    public static buffer2Struct(buffer: string, pVoidStruct: pvoidStruct, offset: number = 0, endian: ENDIAN = 0x00): pvoidStruct {
        let key: string, pType: AbstractBitNumber|AbstractBiString|ArrayL<BitsType>|s_bits|Function, pOffset: number;

        // fill struct
        for (key in pVoidStruct) {
            pType = pVoidStruct[key];

            if (pType instanceof AbstractBitNumber) {
                let nValue: number;

                pOffset = pType.sizeOf();
                nValue = Struct.chr2int(
                    buffer,     // buffer
                    offset,     // offset
                    pOffset,    // sizeOf
                    endian       // endian
                );

                if (pType.getType().equals("int8")){  pVoidStruct[key] = Byte.from(nValue).toInt8();}
                else if (pType.getType().equals("int16")) pVoidStruct[key] = WORD.from(nValue).toInt16();
                else if (pType.getType().equals("int32")) pVoidStruct[key] = DWORD.from(nValue).toInt32();
                // pVoidStruct[key] = int32.from(-1102263091).toUint32().toFloat(); == -0.20
                else if (pType instanceof Float) pVoidStruct[key] = DWORD.from(nValue).toFloat(); // implement endian
                else if (pType instanceof Double) pVoidStruct[key] = QWORD.from(nValue).toDouble(); // implemet endian
                else {
                    // otherwise unsigned number : Byte, WORD, DWORD, QWORD, ...
                    pVoidStruct[key] = pType.getClass<BitsType>().newInstance(nValue);
                }

                if (endian && pType instanceof Float && pType instanceof Double) (<AbstractBitNumber>pVoidStruct[key]).endian();

            } else if (pType instanceof AbstractBiString) {
                let nValue: CString;
                // STRING
                // sizeof != length
                // SIZEOF = STR + [  NULLBYTE + RANGE ]
                // LENGTH = REAL LENGTh OF STR
                nValue = Struct.stringBuffer(buffer, pVoidStruct, <BitsTypeStr>pVoidStruct[key], offset );
                pOffset = nValue.sizeOf();
               /* if(pType instanceof CString ){
                    pVoidStruct[key] = pType.getClass<BitsTypeStr>().newInstance(nValue.valueOf(), pType.getPtr()||pOffset );
                }else*/
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
                        range,      // sizeOf
                        endian      // endian
                    );
                    pType.push(nValue);
                    tOff += range;
                }
            }
            // {}
            else if (typeof pType === "object") {
                pOffset = Struct.sizeOf(pType, true);
                pVoidStruct[key] = Struct.chr2bit(
                    buffer,
                    offset,
                    pType
                );
            }
            offset += pOffset;
        }
        //console.log(pVoidStruct)
        return pVoidStruct;
    }

    public static struct2Buffer( pStruct: pvoidStruct, pVoidStruct: pvoidStruct = null, buffer: string = null ):Buffer{
        let bufferA:string = buffer||"", key:string,
            pType: AbstractBitNumber|AbstractBiString|ArrayL<BitsType>|Function|s_bits;

        for( key in pStruct ){

            // Number
            pType = pStruct[key];
            if( pType instanceof AbstractBitNumber )bufferA += pType.toString();
            else if( pType instanceof AbstractBiString ){
                let end:string = "\x00";

                // check Ptr DWORD check LEn ADD ÿ ending
                if( pType instanceof CString && pType.hasPtr() ){
                    let b:number = 0;

                    if( pType.valueOf().length%pType.getPtr().getRange() > 0 ) b = pType.getPtr().getRange() - (pType.valueOf().length%pType.getPtr().getRange());
                    end += String.repeatString("ÿ",b).toString();
                }
                bufferA += pType.valueOf() + end;
            }
            else if(pType instanceof ArrayL){ console.log("Array"); pType.map(value=>bufferA+= value.toString()); }
            // Sub bits structure
            else if(typeof pType ==="object"&&!(pType instanceof Function)) bufferA += Struct.bit2chr(pType,<s_bits>pVoidStruct[key]);
        }

        return Buffer.from( bufferA,"binary" );
    }

}



