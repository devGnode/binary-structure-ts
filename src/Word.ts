import {AbstractBitNumber} from "./AbstractBitNumber";
import {Types} from "./Globals";
import { RuntimeException } from "lib-utils-ts/src/Exception";
/****
 * WORD
 */
export class WORD extends AbstractBitNumber{

    protected sizeof: Types = Types.WORD;
    protected type:string   = WORD.class().getName();

    constructor(value:number) {super(WORD.$__ctrlOvflw(value));}

    protected static $__ctrlOvflw(value:number):number{
        if( value < 0 && value > 0xffff ) throw new RuntimeException(`Unsigned number 16 bits overflow : [${value}]`);
        return value;
    }

    public toInt16( ):int16{return int16.from(( this.valueOf() << 16 ) >> 16); }

    public Endian():WORD{return WORD.from(super.endian());}

    public static rand( min:number = null, max:number = null ):WORD{
        let n:number = Math.round(Math.random() * 0xff) << 8 | Math.round(Math.random() * 0xff);
        WORD.$__ctrlOvflw(min);
        WORD.$__ctrlOvflw(max);
        if( ( min != null && n >= min )  || ( max != null && n <= max ) ) n =  Math.round((Math.random() * max ) + min );
        return new WORD(n);
    }

    public static instanceOf(o: Object):boolean{ return o instanceof WORD; }

    public static from( value:number = 0xffff ):WORD{return new WORD(value);}
}
/****
 * int16
 */
export class int16 extends WORD{

    protected sizeof: Types = Types.WORD;
    protected type:string   = int16.class().getName();

    constructor(value:number=-1) {super(int16.$__ctrlOvflw(value));}

    protected static $__ctrlOvflw(value:number):number{
        let limit:number = Math.floor(0xffff/2 );
        if( (value < -limit) || (value > limit) ) throw new Error(`Signed number 16 bits overflow : [${value}]`);
        return value;
    }

    public toUin16():uint16{ return uint16.from(this.valueOf()&0xffff); }

    public toString(radix?: number): string {
        return radix && radix === 16 ? super.toString(radix) : this.int2chr(this.toUin16().valueOf(),this.sizeof);
    }

    public Endian():int16{return uint16.from(super.endian()).toInt16();}

    public static rand( min:number = null, max:number = null ):int16{
        return int16.rand(min,max).toInt16();
    }

    public static instanceOf(o: Object):boolean{ return o instanceof int16; }

    public static from( value:number = -1 ):int16{return new int16(value);}
}
/****
 * uint16
 */
export class uint16 extends WORD{

    protected type:string   = uint16.class().getName();

    constructor(value:number=0xffff) {super(value&0xffff);}

    public Endian():uint16{return uint16.from(super.endian());}

    public static instanceOf(o: Object):boolean{ return o instanceof uint16; }

    public static from( value:number = 0xffff ):uint16{return new uint16(value);}
}


export class u_short extends WORD{

    protected type:string   = u_short.class().getName();

    constructor(value:number=0xffff) {super(value&0xffff);}

    public Endian():u_short{return u_short.from(super.endian());}

    public static instanceOf(o: Object):boolean{ return o instanceof u_short; }

   public static from( value:number = 0xffff ):u_short{return new u_short(value);}
}