import {AbstractBitNumber} from "./AbstractBitNumber";
import { Types} from "./Globals";
import {RuntimeException} from "lib-utils-ts/src/Exception";
/****
 * BYte
 */
export class Byte extends AbstractBitNumber{

    protected sizeof:Types  = Types.BYTE;
    protected type:string   = Byte.class().getName();

    constructor(value:number=0xff) {super(Byte.$__ctrlOvflw(value));}

    protected static $__ctrlOvflw(value:number):number{
        if( value < 0 || value > 0xff ) throw new RuntimeException(`Unsigned number 8 bits overflow : [ ${value} ]`);
        return value;
    }

    public toInt8():int8{ return int8.from((( this.valueOf() << 24 ) >> 24)); }

    public Endian():Byte{return Byte.from(super.endian());}

    public static rand( min:number = null, max:number = null ):Byte{
        let n:number = Math.round(Math.random() * 0xff);
        Byte.$__ctrlOvflw(min);
        Byte.$__ctrlOvflw(max);
        if( ( min != null && n >= min )  || ( max != null && n <= max ) ) n =  Math.round((Math.random() * max ) + min );
        return new Byte(n);
    }

    public static instanceOf(o: Object):boolean{ return o instanceof Byte; }

    public static from( value:number = 0xff ):Byte{return new Byte(value);}
}
/****
 * int8
 */
export class int8 extends Byte{

    protected sizeof:Types  = Types.BYTE;
    protected type:string   = int8.class().getName();

    constructor(value:number=-1) {super(int8.$__ctrlOvflw(value));}

    protected static $__ctrlOvflw(value:number):number{
        let limit:number = Math.floor(0xff/2 );
        if( (value < -limit) || (value > limit) ) throw new RuntimeException(`Signed number 8 bits overflow : [ ${value} ]`);
        return value;
    }

    public toUint8():uint8{ return uint8.from(this.valueOf()&0xff); }

    public toString(radix?: number): string {
        return radix && radix === 16 ? super.toString(radix) : this.int2chr(this.toUint8().valueOf(),this.sizeof);
    }

    public Endian():int8{ return uint8.from(super.endian()).toInt8(); }

    public static rand( min:number, max:number ):int8{
        return int8.rand(min,max).toInt8();
    }

    public static instanceOf(o: Object):boolean{ return o instanceof int8; }

    public static from( value:number = -1 ):int8{return new int8(value);}
}
/****
 * uint8
 */
export class uint8 extends Byte{

    protected type:string   = uint8.class().getName();

    constructor(value:number=0xff) {super(value&0xff);}

    public Endian():uint8{return uint8.from(super.endian());}

    public static instanceOf(o: Object):boolean{ return o instanceof uint8; }

    public static from( value:number = 0xff ):uint8{return new uint8(value);}
}




