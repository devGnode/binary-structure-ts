/****
 *
 * @by :
 * @version: 1
 * @date : 2018-01
 */
function floatToDword( float ){
    let bit = Math.abs((float < 0 ? 1 : 0 )<<31),
        exp, i = 0,j = 0; // signed

    float = Math.abs(float);
    while(true){
        j = float>=1?i:-i;
        if(Math.floor(exp = float/Math.pow(2,j) )==1)break;
        i++;
    }

    //
    let mantis = ((exp-Math.floor(exp)) * Math.pow(2,23));
    // for( i = 0; i < 23;i++) mantis=mantis*2;
    mantis = Math.round(mantis);

    return {
        // bit | exp << 23 | mantise
        hex:Math.abs( bit + ((127+j)<<23) | mantis ).toString(16),
        dword:( bit + ((127+j)<<23) | mantis ),

        signed: float < 0,
        mantis:exp,
        k:mantis,
        exposant: 127+j,
        pow: j,

        checkup: exp * Math.pow(2,j),
        check : ( exp*Math.pow(2,j)===float)
    };
}

function dwordToFloat(dword){
    let signed = ( dword >> 31)&0x01,
        exp    = ( dword&0x7f800000 ) >> 23,
        mantis = ( dword&0x7fffff),
        i = 0, k = mantis;

    //for(; i < 23; i++) k = k/2;
    k /= Math.pow(2,23);
    signed= signed===1? -signed : 1;
    k+=1;

    return {
        float: (signed*k*Math.pow(2,exp-127)),
        positive: signed > 0,
        exp: exp,
        mantis: mantis,
        k:k,
    };
}

let k;
console.log(k=floatToDword(-0.20));
console.log(dwordToFloat(k.dword));
