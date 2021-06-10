import {AbstractBitNumber} from "./AbstractBitNumber";
import {Types} from "./Globals";
import {DWORD} from "./Dword";
import {Double} from "./Double";

export class QWORD extends AbstractBitNumber{

    protected sizeof: Types = Types.QWORD;
    protected type:string   = QWORD.class().getName();

    constructor(value:number=0x00) {super(value);}

    public toDouble(  ):Double{
        let value:number    = this.valueOf(),
            signed:number   = (value/Math.pow( 2, 63))&0x01,
            exp:number      = Math.floor(value/Math.pow( 2, 52))&0x7ff,
            mantis:number   = Math.floor(value-(exp*Math.pow( 2, 52))-(signed*Math.pow( 2, 63)));

        signed = signed.equals(1) ? -signed : 1;
        let k:number = (mantis/Math.pow( 2, 51))+1;

        return Double.from(signed*k*Math.pow( 2, exp-1023));
    }

    public static instanceOf(o: Object):boolean{ return o instanceof QWORD; }

    public static from( value:number = 0x00 ):QWORD{return new QWORD(value);}
}

export class int64 extends DWORD{

    protected type:string = int64.class().getName();

    constructor(value:number=0x00) {super(value);}

    public static instanceOf(o: Object):boolean{ return o instanceof int64; }

    public static from( value:number = 0x00 ):int64{return new int64(value);}
}

export class u_long extends DWORD{

    protected type:string = u_long.class().getName();

    constructor(value:number=0x00) {super(value);}

    public static instanceOf(o: Object):boolean{ return o instanceof u_long; }

    public static from( value:number = 0x00 ):u_long{return new u_long(value);}
}