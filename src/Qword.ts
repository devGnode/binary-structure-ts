import {Operator} from "./Operator";
import {PrimitiveNumber} from "./PrimitiveNumber";
import {int64, QWORD} from "./Globals";
import {Double} from "./Double";
/***
 * @notDone
 */
export class Qword extends PrimitiveNumber.Unsigned64 implements QWORD{

    constructor(value: Number = null) {
        super(value);
        this.orThrow();
    }

    public endian(): Qword {return Qword.mk(super.endian().valueOf())}

    public operators(): Operator<Qword> {return new Operator<Qword>(this);}

    public toInt64(): Int64 {return new Int64(0);}

    public toDouble(  ):Double{
        let value:number    = this.valueOf(),
            signed:number   = (value/Math.pow( 2, 63))&0x01,
            exp:number      = Math.floor(value/Math.pow( 2, 52))&0x7ff,
            mantis:number   = Math.floor(value-(exp*Math.pow( 2, 52))-(signed*Math.pow( 2, 63)));

        signed = signed.equals(1) ? -signed : 1;
        let k:number = (mantis/Math.pow( 2, 51))+1;

        return Double.mk(signed*k*Math.pow( 2, exp-1023));
    }

    public static mk(value: number = null): Qword {return new Qword(value);}

    public static random(min: Qword = null, max: Qword = null): Qword {
        return Qword.mk(Qword.mk(0).random(min, max).valueOf());
    }
}

export class Int64 extends PrimitiveNumber.Signed64 implements int64{

    constructor(value: Number = null) {
        super(value);
        this.orThrow();
    }

    public endian():Int64 {return Int64.mk(super.endian().valueOf())}

    public operators(): Operator<Int64> {return new Operator<Int64>(this);}

    public toUint64(): Qword {return Qword.mk(0);}

    public static mk(value: number = null): Int64 {return new Int64(value);}

    public static random(min: Int64 = null, max: Int64 = null): Int64 {
        return Int64.mk(Int64.mk(0).random(min, max).valueOf());
    }
}