/****
 *
 * @by :
 * @version: 1
 * @date : 2018-03
 */
function doubleToDword( float ){
    var bit = (float<0?1:0)*Math.pow(2,63),
        exp, i = 0,j = 0;

    if(float===0)return { dword:0.00 };

    float = Math.abs(float);
    while(true){
        j = float>=1?i:-i;
        if(Math.floor(exp = float/Math.pow(2,j))===1)break;
        i++;
    }

    let mantis = Math.round((exp-Math.floor(exp))*Math.pow(2,51));

    return {
        // bit | exp << 23 | mantise
        hex:Math.abs( bit + (1023+j)*Math.pow(2,52) + mantis ).toString(16),
        qword:( bit + ((1023+j)*Math.pow(2,52)) + mantis ),

        signed: float < 0,
        mantis:exp,
        k:mantis,
        exposant: 1023+j,
        pow: j,

        checkup: exp * Math.pow(2,j),
        check : ( exp*Math.pow(2,j)===float)
    };
}

function qwordToDouble(qword){
    var signed = (qword/Math.pow(2,63))&0x01,
        exp    = Math.floor(qword/Math.pow(2,52))&0x7ff,
        mantis = Math.floor(qword-(exp*Math.pow(2,52))-(signed*Math.pow(2,63)));

    console.log(exp*Math.pow(2,52),",",mantis.toString(16));
    signed= signed===1? -signed : 1;
    let k = (mantis/Math.pow(2,51))+1;

    return {
        float: (signed*k*Math.pow(2,exp-1023)),
        positive: signed > 0,
        exp: exp,
        mantis: mantis,
        k:k,
    };
}


let ku;
console.log( ku=doubleToDword(-0.25555556123) );
console.log("**",qwordToDouble(ku.qword));
