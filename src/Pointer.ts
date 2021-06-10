import {BitsType, Types} from "./Globals";
import {AbstractBiString} from "./AbstractBiString";
import { RuntimeException } from "lib-utils-ts/src/Exception";
import {uint8} from "./Byte";
import { AbstractBitNumber } from "./AbstractBitNumber";
import { Define } from "lib-utils-ts/src/Define";
/*****
 * Structure Pointer
 */
export class Pointer<T> extends AbstractBiString{

    protected sizeof: Types = Types.VOID;
    protected type:string   = Pointer.class().getName();

    private readonly value:T;
    private readonly range:number;

    constructor( value:T = null, name:string, range:Types = Types.BYTE) {
        super(name);
        this.range = range;
        this.value = value;
    }

    public getType():string{ return this.type; }

    public sizeOf(): number {return this.sizeof;}

    public pointerName():string{ return this.valueOf(); }

    public getRange( ):number{ return this.range; }

    public toString( ): string {return void 0;}

    public getValue( ):T{ return this.value;}

    public static from<T>( value:T = null, ptr:string, range:Types = Types.BYTE  ):Pointer<T>{
        return new Pointer<T>(value, ptr, range);
    }
}

export class Char extends AbstractBiString{

    protected sizeof: Types = Types.BYTE;
    protected type:string   = Char.class().getName();

    constructor(value:string|number = 0xff ) {super(Char.$__ctrlOvflw(value));}

    private static $__ctrlOvflw(value:string|number):string{
        let crtl:number = typeof value === "string"  ? value.charCodeAt(0) : value;
        if( (crtl < 0x00 ) || (crtl > 0xFF) ) throw new RuntimeException(`Signed Char 8 bits overflow : [ ${crtl} ]`);
        return String.fromCharCode(crtl);
    }

    public getType():string{ return this.type; }

    public sizeOf(): number {return this.sizeof;}

    public toString( ): string {return this.valueOf();}

    public toArray():Array<string>{return new Array<string>(this.valueOf());}

    public toUint8( ):uint8{return uint8.from(this.valueOf().charCodeAt(0));}

    public static from(value:string|number = 0xff ):Char{return new Char(value);}

}

export class CString extends AbstractBiString{

    protected sizeof: Types = Types.VOID;
    protected type:string   = CString.class().getName();
    private readonly  ptr:Pointer<BitsType>;

    constructor(value:string = "", sizeof:number|Pointer<BitsType> ) {
        super(value = value!==null?value:"");
        if(sizeof instanceof Pointer) {
            this.ptr = sizeof;
            sizeof = 0;
        }

        this.sizeof = sizeof||value.length||0;
    }

    public getType():string{ return this.type; }

    public sizeOf(): number {return this.sizeof;}

    public toString( ): string {return void 0;}

    public hasPtr( ):boolean{ return !Define.of(this.ptr).isNullable(); }

    public getPtr():Pointer<BitsType>{return this.ptr;}

    public static from( value = null, size:number|Pointer<BitsType> = Types.VOID ):CString{return new CString(value,size);}

}