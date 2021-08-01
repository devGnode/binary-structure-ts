import {RuntimeException} from "lib-utils-ts/src/Exception";
/****
 * @NumericOverflow
 */
export class NumericOverflow extends RuntimeException{
    /****
     *
     */
    name = NumericOverflow.class().getName();
    /****
     *
     */
    constructor(ex) {super(ex);}
}