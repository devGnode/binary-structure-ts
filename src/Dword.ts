import {AbstractBitNumber} from "./AbstractBitNumber";
import {Types} from "./Globals";
import {Float} from "./Float";
import { RuntimeException } from "lib-utils-ts/src/Exception";
/****
 * DWORD
 */
export class DWORD extends AbstractBitNumber{

    protected sizeof: Types = Types.DWORD;
    protected type:string   = DWORD.class().getName();

    constructor(value:number= 4294967295 ) {super(DWORD.$__ctrlOvflw(value));}

    private static $__ctrlOvflw(value:number):number{
        if( value < 0 || value > 0xffffffff ) throw new RuntimeException(`Unsigned number 32 bits overflow : [ ${value} ]`);
        return value;
    }

    public toInt32():int32{ return int32.from(this.valueOf()&0xffffffff); }

    public toFloat( ):Float{
        let valueOf:number = this.valueOf(),
            signed:number  = ( valueOf >> 31 )&0x01,
            exp:number     = ( valueOf&0x7f800000 ) >> 23,
            mantis:number  = ( valueOf&0x7fffff);

        mantis = ( mantis / Math.pow( 2, 23 )) + 1;

        return Float.from( (signed === 1 ? -signed : 1 ) * mantis *  Math.pow(2, exp-127 ) );
    }

    public Endian():DWORD{return DWORD.from(super.endian());}

    public static instanceOf(o: Object):boolean{ return o instanceof DWORD; }

    public static from( value:number = 4294967295 ):DWORD{return new DWORD(value);}
}
/****
 * int32
 */
export class int32 extends AbstractBitNumber{

    protected sizeof: Types = Types.DWORD;
    protected type:string = int32.class().getName();

    constructor(value:number=-1) {super(int32.$__ctrlOvflw(value));}

    private static $__ctrlOvflw(value:number):number{
        let limit:number = Math.floor(0xffffffff/2 );
        if( (value < -limit) || (value > limit) ) throw new Error(`Signed number 32 bits overflow : [ ${value} ]`);
        return value;
    }

    public toUint32():uint32{return uint32.from(parseInt(this.toHex(),16));}

    public toString(radix?: number): string {
        return radix && radix === 16 ? super.toString(radix) : this.int2chr(this.toUint32().valueOf(),this.sizeof);
    }

    public Endian():int32{return int32.from(super.endian());}

    public static instanceOf(o: Object):boolean{ return o instanceof int32; }

    public static from( value:number = -1 ):int32{return new int32(value);}
}
/****
 * uint32
 */
export class uint32 extends DWORD{

    protected type:string = uint32.class().getName();

    constructor(value:number=0x00) {super(value);}

    public Endian():uint32{return uint32.from(super.endian());}

    public static instanceOf(o: Object):boolean{ return o instanceof uint32; }

    public static from( value:number = 0x00 ):uint32{return new uint32(value);}
}