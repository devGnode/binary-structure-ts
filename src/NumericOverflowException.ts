import {RuntimeException} from "lib-utils-ts/src/Exception";
/****
 * @NumericOverflowException
 */
export class NumericOverflowException extends RuntimeException{
    /****
     *
     */
    name = NumericOverflowException.class().getName();
    /****
     *
     */
    constructor(ex) {super(ex);}
}