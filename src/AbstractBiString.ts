import {bitString, Types} from "./Globals";
import { flombok } from "lib-utils-ts/src/flombok";

export class AbstractBiString extends String implements bitString{

    @flombok.ENUMERABLE(false,0)
    protected sizeof: Types;
    @flombok.ENUMERABLE(false)
    protected type:string;

    protected constructor(value:string= "") {super(value);}

    public toHex():string{  return Buffer.from(this.valueOf(),"utf-8").toString("hex"); }

    public sizeOf(): number {return this.sizeof;}

    getType(): string {return this.type;}

}