import {BitsType, Types} from "./Globals";
import {AbstractBitNumber} from "./AbstractBitNumber";
import {Byte, int8} from "./Byte";
import { constructor } from "lib-utils-ts/src/Interface";
import {int16, WORD} from "./Word";
import {DWORD, int32} from "./Dword";
import {int64, QWORD} from "./QWORD";
import {Float} from "./Float";
import {Double} from "./Double";

export class ArrayL<T extends BitsType> extends Array<any>{

    private readonly type: constructor<T>;
    private readonly sizeof:number = Types.VOID;

    constructor(type: Function, sizeof:number = Types.VOID ) {
        super();
        this.type = type.class<T>();
        this.sizeof = sizeof;
        this.fill(0, sizeof );
    }

    public push<U extends number>(...items:number[]): number {
        // check overflow
        //if(this.length<this.sizeof)
        if( this.type instanceof  AbstractBitNumber) items[0] = Number(this.type.newInstance(items[0]).valueOf());
        return super.push(items);
    }

    public get( value:number ):T{return this.type.newInstance(this[value]);}

    public getType( ):string{return this.type.getName()+ArrayL.class().getName(); }

   public sizeOf():number{return (this.length||this.sizeof) * this.getRange();}

   public getRange():number{ return this.type.newInstance(0).sizeOf(); }

}

export class ByteArray extends ArrayL<Byte>{
    constructor(sizeOf:number) {super(Byte,sizeOf);}
    public static inst(sizeof:number = 0):ByteArray{return new ByteArray(sizeof);}
}
export class int8Array extends ArrayL<int8>{
    constructor(sizeOf:number) {super(int8,sizeOf);}
    public static inst(sizeof:number = 0):int8Array{return new int8Array(sizeof);}
}
export class WordArray extends ArrayL<WORD>{
    constructor(sizeOf:number) {super(WORD,sizeOf);}
    public static inst(sizeof:number = 0):WordArray{return new WordArray(sizeof);}
}
export class int16Array extends ArrayL<int16>{
    constructor(sizeOf:number) {super(int16,sizeOf);}
    public static inst(sizeof:number = 0):int16Array{return new int16Array(sizeof);}
}
export class DwordArray extends ArrayL<DWORD>{
    constructor(sizeOf:number) {super(DWORD,sizeOf);}
    public static inst(sizeof:number = 0):DwordArray{return new DwordArray(sizeof);}
}
export class int32Array extends ArrayL<int32>{
    constructor(sizeOf:number) {super(int32,sizeOf);}
    public static inst(sizeof:number= 0):int32Array{return new int32Array(sizeof);}
}
export class QwordArray extends ArrayL<QWORD>{
    constructor(sizeOf:number) {super(QWORD,sizeOf);}
    public static inst(sizeof:number = 0):QwordArray{return new QwordArray(sizeof);}
}
export class int64Array extends ArrayL<int64>{
    constructor(sizeOf:number) {super(int64,sizeOf);}
    public static inst(sizeof:number = 0):int64Array{return new int64Array(sizeof);}
}
export class FloatArray extends ArrayL<Float>{
    constructor(sizeOf:number) {super(Float,sizeOf);}
    public static inst(sizeof:number= 0):FloatArray{return new FloatArray(sizeof);}
}
export class DoubleArray extends ArrayL<Double>{
    constructor(sizeOf:number) {super(Double,sizeOf);}
    public static inst(sizeof:number = 0):DoubleArray{return new DoubleArray(sizeof);}
}
