import {Types} from "./Globals";
import {AbstractBitNumber} from "./AbstractBitNumber";
import {QWORD} from "./QWORD";


export class Double  extends AbstractBitNumber{

    protected sizeof: Types = Types.double&0xf;
    protected type:string   = Double.class().getName();

    constructor(value:number=0.00) {super(value)}

    public valueOf(): number {return super.valueOf() === 0 ? 0.00 : super.valueOf();}

    public toQword( ):QWORD{
        let bit:number = (this.valueOf()<0?1:0)*Math.pow(2,63),
            exp:number,i:number = 0,j:number = 0, mantis:number,
            tmp:number = this.valueOf();

        if(this.valueOf().equals(0))return QWORD.from(0);
        tmp = Math.abs(tmp);
        while ( true ){
            j = tmp>=1?i:-i;
            if(Math.floor( exp = tmp/Math.pow( 2, j))===1)break;
            i++;
        }

        mantis = Math.round( (exp - Math.floor(exp))* (Math.pow( 2, 51)) );

        return QWORD.from(bit + ((1023+j)*Math.pow(2,52)) + mantis );
    }

    public toString(radix?: number): string {
        return radix && radix === 16 ? this.toQword().toHex() : this.int2chr(this.toQword().valueOf(),this.sizeof);
    }

    public static instanceOf(o: Object):boolean{ return o instanceof Double; }

    public static from( value:number = 0.00 ):Double{return new Double(value);}
}