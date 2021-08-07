import {Operator} from "./Operator";
import { PrimitiveNumber} from "./PrimitiveNumber";
import {int8,BYTE} from "./Globals";
/****
* @Byte
 * @IOException
 * @NumericOverflow
*/
export class Byte extends PrimitiveNumber.Unsigned8 implements BYTE{

    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }
    /****
     *
     */
    public endian():Uint8{return Uint8.mk(super.endian().valueOf())}
    /****
     *
     */
    public operators( ):Operator<Uint8>{return new Operator<Uint8>(this);}
    /****
     *
     */
    public toInt8():Int8 {return Int8.mk((( this.valueOf() << 24 ) >> 24)); }
    /****
     *
     */
    public static mk(value:number=null):Byte{return new Byte(value);}
    /****
     *
     */
    public static random(min:  Byte = null, max:  Byte = null): Byte {
        return Byte.mk(Byte.mk(0).random(min, max).valueOf());
    }
}
/****
 * @Uint8
 *
 */
export class Uint8 extends PrimitiveNumber.Unsigned8 implements BYTE{

    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }
    /****
     *
     */
    public endian():Uint8{return Uint8.mk(super.endian().valueOf())}
    /****
     *
     */
    public operators( ):Operator<Uint8>{return new Operator<Uint8>(this);}
    /****
     *
     */
    public toInt8():Int8 {return Int8.mk((( this.valueOf() << 24 ) >> 24)); }
    /****
     *
     */
    public static mk(value:number=null):Uint8{return new Uint8(value);}
    /****
     *
     */
    public static random(min: Uint8 = null, max: Uint8 = null): Uint8 {
        return  Uint8.mk(Byte.mk(0).random(min, max).valueOf());
    }
}
/****
 * @Int8
 *
 */
export class Int8 extends PrimitiveNumber.Signed8 implements int8{

    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }
    /****
     *
     */
    public endian():Int8{return new Int8(super.endian().valueOf())}
    /****
     *
     */
    public operators( ):Operator<Int8>{return new Operator<Int8>(this);}
    /****
     *
     */
    public toUint8(): Uint8 {return new Uint8(this.valueOf()&0xff);}
    /****
     *
     */
    public static mk(value:number=null):Int8{return new Int8(value);}
    /****
     *
     */
    public static random(min: Int8 = null, max: Int8 = null): Int8 {
        return  Int8.mk(Int8.mk(0).random(min, max).valueOf());
    }
}




