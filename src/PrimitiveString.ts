import {RuntimeException} from "lib-utils-ts/src/Exception";
import {BitsType, char, cString, primitiveString, Types, uint8} from "./Globals";
import {Uint8} from "./Byte";
import {Pointer} from "./Pointer";
import {Define} from "lib-utils-ts/src/Define";

export abstract class PrimitiveString {

    private static isOverflow(buffer:string, sizeof:number ):string{
        console.log(buffer.length, sizeof)
        if(buffer.length > sizeof )throw new RuntimeException("String overflow");
        return buffer;
    }

    public static PrimitiveStrBuilder = class PrimitiveStrBuilder extends String implements primitiveString {

        readonly sizeof:number = Types.VOID;

        constructor(value:string, sizeof: number) {
            super(PrimitiveString.isOverflow(value, sizeof));
            this.sizeof = sizeof;
        }
        /***
         *
         */
        public getType(): string {return this.getClass().getName();}
        /***
         *
         */
        public sizeOf(): number {return this.sizeof}

    }
    /***
     *
     *
     *
     */
    public static Char = class Char extends PrimitiveString.PrimitiveStrBuilder implements char {
        constructor(value:string) {super(value,Types.BYTE);}

        public toUint8(): uint8 {return new Uint8(this.toString().charCodeAt(0));}
    }
    /***
     *
     *
     *
     */
    public static CString = class CString extends PrimitiveString.PrimitiveStrBuilder implements cString {

        readonly pointer: Pointer<BitsType>;
        /***
         * @param value
         * @param sizeof
         */
        constructor(value:string, sizeof: number|Pointer<BitsType> = Types.VOID ) {
            super(
                Define.of(value).orNull(""),
                sizeof instanceof Pointer ? 0 : sizeof||value.length||Types.VOID
            );
            if( sizeof instanceof Pointer )this.pointer = sizeof;
        }
        /***
         *
         */
        getPointer(): Pointer<BitsType> {return Object.requireNotNull(this.pointer);}
        /***
         *
         */
        hasPointer(): boolean {return !Object.isNull(this.pointer);}

    }
}