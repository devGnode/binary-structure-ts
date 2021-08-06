import {Operator} from "./Operator";
import {PrimitiveNumber} from "./PrimitiveNumber";
import {DWORD, int32} from "./Globals";
import {Float} from "./Float";
import {Word} from "./Word";
import {Convert} from "./Convert";
/***
 * @Dword
 *
 */
export class Dword extends PrimitiveNumber.Unsigned32 implements DWORD{

    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }

    public endian():Dword{return new Dword(super.endian().valueOf())}

    public operators( ):Operator<Dword>{return new Operator<Dword>(this);}

    public toInt32():Int32 {return Int32.mk(this.valueOf()&0xFFFFFFFF ); }

    public toFloat(): Float {
        let valueOf:number = this.valueOf(),
            signed:number  = ( valueOf >> 31 )&0x01,
            exp:number     = ( valueOf&0x7f800000 ) >> 23,
            mantis:number  = ( valueOf&0x7fffff);

        mantis = ( mantis / Math.pow( 2, 23 )) + 1;

        return Float.mk( (signed === 1 ? -signed : 1 ) * mantis *  Math.pow(2, exp-127 ) );
    }

    public static mk(value:number=null):Dword{return new Dword(value);}

    public static random(min: Dword = null, max: Dword = null): Dword {
        return Dword.mk(Word.mk(0).random(min, max).valueOf());
    }
}
/***
 * @Uint32
 *
 */
export class Uint32 extends PrimitiveNumber.Unsigned32 implements DWORD{

    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }

    public endian():Uint32{return new Uint32(super.endian().valueOf())}

    public operators( ):Operator<Uint32>{return new Operator<Uint32>(this);}

    public toInt32():Int32 {return Int32.mk(this.valueOf()&0xFFFFFFFF ); }

    public toFloat(): Float { return Dword.mk(this.valueOf()).toFloat(); }

    public static mk(value:number=null):Uint32 {return new Uint32(value);}

    public static random(min: Uint32 = null, max: Uint32 = null): Uint32 {
        return Uint32.mk(Dword.mk(0).random(min, max).valueOf());
    }
}
/***
 * @Int32
 *
 */
export class Int32 extends PrimitiveNumber.Signed32 implements int32{

    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }

    public endian():Int32{return new Int32(super.endian().valueOf())}

    public operators( ):Operator<Int32>{return new Operator<Int32>(this);}

    public toUint32():Uint32 {
        return Uint32.mk(Convert.arrayToNumber( PrimitiveNumber.slice32(this.valueOf()) ));
    }

    public static mk(value:number=null):Int32{return new Int32(value);}

    public static random(min: Int32 = null, max: Int32 = null): Int32 {
        return Int32.mk(Int32.mk(0).random(min, max).valueOf());
    }
}