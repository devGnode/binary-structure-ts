import {BitsType, char, cString, Types} from "./Globals";
import {Pointer} from "./Pointer";
import {PrimitiveString} from "./PrimitiveString";
import {Define} from "lib-utils-ts/src/Define";
/***
 * @Char
 */
export class Char extends PrimitiveString.Char implements char{
    /**
     *
     */
    constructor(value:string|number = "") {super( ( typeof value === "string" ) ? Define.of(value).orNull("\x00") : String.fromCharCode(Number(value)));}
    /**
     *
     */
    public valueOf(): string {return this.toString();}
    /**
     *
     */
    public static from(value:string|number = "" ){return new Char(value);}
}
/***
 * @CString
 */
export class CString extends PrimitiveString.CString implements cString{
    /**
     *
     */
    constructor(value:string = "",sizeof: number|Pointer<BitsType> = Types.VOID) {super(Define.of(value).orNull(""), sizeof);}
    /**
     *
     */
    public valueOf(): string {return this.toString();}
    /**
     *
     */
    public static of(value:string = "", sizeof: number|Pointer<BitsType> = Types.VOID){return new CString(value, sizeof);}
}
