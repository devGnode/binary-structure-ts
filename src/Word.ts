import {int16, WORD} from "./Globals";
import {Operator} from "./Operator";
import {PrimitiveNumber} from "./PrimitiveNumber";
/****
 * @Word
 * @IOException
 * @NumericOverflow
 */
export class Word extends PrimitiveNumber.Unsigned16 implements WORD{
    /****
     *
     */
    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }
    /****
     *
     */
    public endian():Word{return new Word(super.endian().valueOf())}
    /****
     *
     */
    public operators( ):Operator<Word>{return new Operator<Word>(this);}
    /****
     *
     */
    public toInt16():Int16 {return Int16.mk(( this.valueOf() << 16 ) >> 16 ); }
    /****
     *
     */
    public static mk(value:number=null):Word{return new Word(value);}
    /****
     *
     */
    public static random(min: Word = null, max: Word = null): Word {
        return Word.mk(Word.mk(0).random(min, max).valueOf());
    }
}
/****
 * @Uint16
 */
export class Uint16 extends PrimitiveNumber.Unsigned16 implements WORD{
    /****
     *
     */
    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }
    /****
     *
     */
    public endian():Uint16{return new Uint16(super.endian().valueOf())}
    /****
     *
     */
    public operators( ):Operator<Uint16>{return new Operator<Uint16>(this);}
    /****
     *
     */
    public toInt16():Int16 {return new Int16(( this.valueOf() << 16 ) >> 16 ); }
    /****
     *
     */
    public static mk(value:number=null):Uint16{return new Uint16(value);}
    /****
     *
     */
    public static random(min: Uint16 = null, max: Uint16  = null): Uint16 {
        return Uint16.mk(Word.mk(0).random(min, max).valueOf());
    }
}

/****
 * @Int16
 */
export class Int16 extends PrimitiveNumber.Signed16 implements int16{
    /****
     *
     */
    constructor(value:Number=null) {
        super(value);
        this.orThrow();
    }
    /****
     *
     */
    public endian():Int16{return new Int16(super.endian().valueOf());}
    /****
     *
     */
    public operators( ):Operator<Int16>{return new Operator<Int16>(this);}
    /****
     *
     */
    public toUint16():Uint16 {return new Uint16(this.valueOf()&0xffff); }
    /****
     *
     */
    public static mk(value:number=null):Int16{return new Int16(value);}
    /****
     *
     */
    public static random(min: Int16 = null, max:Int16 = null): Int16 {
        return Int16.mk(Int16.mk(0).random(min, max).valueOf());
    }
}