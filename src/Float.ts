import {AbstractBitNumber} from "./AbstractBitNumber";
import {Types} from "./Globals";
import {DWORD} from "./Dword";

export class Float extends AbstractBitNumber{

    protected sizeof: Types = Types.float&0xf;
    protected type:string   = Float.class().getName();

    constructor(value:number=0.00) {super(value);}

    public valueOf(): number {return super.valueOf() === 0 ? 0.00 : super.valueOf();}

    public toDword( ):DWORD{
        let valueOf:number = this.valueOf(),
            signed:number = Math.abs( (valueOf<0?1:0) << 31 ),
            i:number = 0, j:number = 0,
            exp:number, mantis:number;

        valueOf = Math.abs(valueOf);
        while(true){
            j = valueOf>=1?i:-i;
            if(Math.floor( exp = valueOf/Math.pow(2, j)) === 1 && Math.pow( 2, j)*exp === valueOf) break;
            i++;
        }
        mantis = (exp-Math.floor(exp)) * Math.pow(2,23);

        return DWORD.from( signed + ( ( 127 + j ) << 23 ) + Math.floor(mantis) );
    }

    public toString(radix?: number): string {
        return radix && radix === 16 ? this.toDword().toHex() : this.int2chr(this.toDword().valueOf(),this.sizeof);
    }

    public static instanceOf(o: Object):boolean{ return o instanceof Float; }

    public static from( value:number = 0.00 ):Float{return new Float(value);}
}