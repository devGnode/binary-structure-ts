import {BitsType, Types, uint8, WORD, int16, DWORD, int32, QWORD, int64} from "./Globals";
import {Uint8} from "./Byte";
import { constructor } from "lib-utils-ts/src/Interface";
import {Float} from "./Float";
import {Int16, Word} from "./Word";
import {Int32} from "./Dword";
import {Double} from "./Double";
import {Int64, Qword} from "./Qword";


export class ArrayL<T extends BitsType> extends Array<T>{

    private readonly type: constructor<T>;
    private readonly sizeof:number = Types.VOID;

    constructor(type: Function, sizeof:number = Types.VOID ) {
        super();
        this.type = type.class<T>();
        this.sizeof = sizeof;
        this.fill(this.type.newInstance(0), sizeof );
    }

    public add(items:number): void{
        this.push(this.type.newInstance(items));
    }

    public push(...items:T[]): number {
        let tmp:T, i:number=0;
        while (!Object.isNull(tmp=items[i])){
            super.push(tmp)
            i++;
        }
        return 0;
    }

    public get( value:number ):T{return this[value];}

    public getType( ):string{return this.type.getName()+ArrayL.class().getName(); }

   public sizeOf():number{return (this.length||this.sizeof) * this.getRange();}

   public getRange():number{ return this.type.newInstance(0).sizeOf(); }

}

export class ByteArray extends ArrayL<uint8>{
    constructor(sizeOf:number) {super(Uint8,sizeOf);}
    public static mk(sizeof:number = 0):ByteArray{return new ByteArray(sizeof);}
}
export class int8Array extends ArrayL<uint8>{
    constructor(sizeOf:number) {super(Uint8,sizeOf);}
    public static mk(sizeof:number = 0):int8Array{return new int8Array(sizeof);}
}
export class WordArray extends ArrayL<WORD>{
    constructor(sizeOf:number) {super(Word,sizeOf);}
    public static mk(sizeof:number = 0):WordArray{return new WordArray(sizeof);}
}
export class int16Array extends ArrayL<int16>{
    constructor(sizeOf:number) {super(Int16,sizeOf);}
    public static mk(sizeof:number = 0):int16Array{return new int16Array(sizeof);}
}
export class DwordArray extends ArrayL<DWORD>{
    constructor(sizeOf:number) {super(DwordArray,sizeOf);}
    public static mk(sizeof:number = 0):DwordArray{return new DwordArray(sizeof);}
}
export class int32Array extends ArrayL<int32>{
    constructor(sizeOf:number) {super(Int32,sizeOf);}
    public static mk(sizeof:number= 0):int32Array{return new int32Array(sizeof);}
}
export class QwordArray extends ArrayL<QWORD>{
    constructor(sizeOf:number) {super(Qword,sizeOf);}
    public static mk(sizeof:number = 0):QwordArray{return new QwordArray(sizeof);}
}
export class int64Array extends ArrayL<int64>{
    constructor(sizeOf:number) {super(Int64,sizeOf);}
    public static mk(sizeof:number = 0):int64Array{return new int64Array(sizeof);}
}
export class FloatArray extends ArrayL<Float>{
    constructor(sizeOf:number) {super(Float,sizeOf);}
    public static mk(sizeof:number= 0):FloatArray{return new FloatArray(sizeof);}
}
export class DoubleArray extends ArrayL<Double>{
    constructor(sizeOf:number) {super(Double,sizeOf);}
    public static mk(sizeof:number = 0):DoubleArray{return new DoubleArray(sizeof);}
}