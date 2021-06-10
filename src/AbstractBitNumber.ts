import {bitNumber, ENDIAN, LIMIT, SZB, Types} from "./Globals";
import {flombok} from "lib-utils-ts/src/flombok";
import { RuntimeException } from "lib-utils-ts/src/Exception";
/****
 *
 */
export abstract class AbstractBitNumber extends Number implements bitNumber{

    @flombok.ENUMERABLE(false,0)
    protected sizeof: Types;
    @flombok.ENUMERABLE(false)
    protected type:string;

    protected constructor(value:number=0x00) {super(value);}

    public toHex():string{
        let value:number = this.valueOf(), sizeOf:number,
            //
            round:Function = (v:string, sizeOfA:number ):string=>{
                let sz:number = Math.abs( Math.pow( 2, sizeOfA||sizeOf || 1 )-v.length );
               return  sz !== 0 ? String.repeatString("0",Math.abs(sz))+v :v;
            }

         // ToDo : implement 64bits neg number conversion to hex
        sizeOf = this.sizeOf().equals(4) ? 3 : this.sizeOf().equals(8) ? 4 : this.sizeOf();
        if(value<0){
            let tmp:string = "";

            if(this.sizeof>=4)  tmp += round( (( value >> 24 )&0xff).toString(16), 1 )+round( (( value >> 16 )&0xff).toString(16), 1 );
            if(this.sizeof>=2)  tmp += round( (( value >> 8 )&0xff).toString(16), 1 );
            if(this.sizeof>=1)  tmp += round( ( value&0xff).toString(16), 1 );

            return tmp;
        }

        return round(this.valueOf().toString(16));
    }

    public signed():boolean{ return Boolean( Types[this.type]&0xf0 >> 1 ); }

    private endianA( value:AbstractBitNumber ):number{
        let v:number = value.valueOf();
        return value.sizeOf() === Types.BYTE ? v&0xFF :
               value.sizeOf() === Types.WORD ?  ( v&0xFF ) << 8 | ( ( v >> 8 )&0xFF )&0xFFFF :
               value.sizeOf() === Types.DWORD ? ( v&0xFF ) << 24 | ( ( v >> 8 )&0xFF ) << 16 | ( ( v >> 16 )&0xFF ) << 8 | (v>>24)&0xFF:
               // QWORD IMPLEMENTATION
               // HERE
               this.endianA( new class extends AbstractBitNumber{
                   protected sizeof: Types = Types.DWORD;
                   // @override
                   constructor() {super(v);}
               } ); // default 32bits
    }

    public endian():number{return this.endianA(this).valueOf();}

    public getType():string{ return this.type; }

    public sizeOf(): number {return this.sizeof;}

    private static defineType( value:number ):number{
        return  value <= LIMIT.DB ? Types.BYTE :
                value > LIMIT.DB && value <= LIMIT.WD ? Types.WORD :
                value > LIMIT.WD && value <= LIMIT.DW ? Types.DWORD :
                value > LIMIT.DW && value <= LIMIT.QW ? Types.QWORD
                 : 0;
    }
    /*
     * pack binaryStringBuffer
     *
     * min 8 bits max 32 bits with bitwise method
     * review this for accept 64 bits method
     */
    public static int2chr( value:number, sizeof:number = null, endian:ENDIAN = 0 ):string{
        let frame:string = "", b64:number = 0,
            ror:number = ( !sizeof ? AbstractBitNumber.defineType( value ) : sizeof ) * 8;

        if( value > Math.pow( 2 , ror )  ) throw new RuntimeException( `Overflow numeric( ${value} ) into ${AbstractBitNumber.defineType(value)} byte(s) ${(ror/8)} byte(s) value`);

        if( value > Math.pow( 2, SZB.DW ) ){
            b64 = ((value-(value&0xffffffff))/4294967296); // gethigh
            value = (value&0xffffffff)-1; // getLow
            ror/=2;
        }

        while( ror > 0 ) frame+= String.fromCharCode(( value >> (ror-=0x08) )&0xff);
        if( Boolean(endian) ) frame = frame.split("").reverse().join("");

        // b64
        if(Boolean(b64)){
            if(Boolean(endian)) frame = this.int2chr(b64, Types.DWORD, endian) + frame;
            else{
                frame +=  this.int2chr(b64, Types.DWORD, endian);
            }
        }
        return frame;
    }

    protected int2chr(value:number, sizeof:number, endian:ENDIAN = 0):string{
        return AbstractBitNumber.int2chr(value, sizeof, endian);
    }

    public toString(radix?: number): string {
        return radix && radix === 16 ? this.toHex() : this.int2chr(this.valueOf(),this.sizeof);
    }

    public rand( min:number = null, max:number = null ){

    }
}

