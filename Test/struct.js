(function( window ){
    /*
     v 1.0 : unsigned 8,16,32 bits ( 2016 )
     v 1.1 : signed, unsigned
     v 1.3 : endian
     v 2.0 : CONST, throw Exception, ~support 64 bits
     @ by :
     @ 2018-12
     @ looterofflux,maroder
    */
    var struct = struct || {

        v:"2.0",
        /*
         # typage struct
        */
        BYTE :   0x01,
        WORD :   0x02,
        DWORD:   0x04,
        QWORD:   0x08,
        int8 :   0x11,
        int16:   0x12,
        int32:   0x14,
        int64:   0x18,
        // 4 bytes , 4 bytes
        // (0x1fffffff&0xf0000000)>>28 > -1 = + not -
        float:   0x104,

        /*SIZEBITS*/
        SZB_DB: 0x08,
        SZB_WD: 0x10,
        SZB_DW: 0x20,
        SZB_QW: 0x40,

        /*SIZEOF*/
        SZ_DB:  0x01,
        SZ_WD:  0x02,
        SZ_DW:  0x04,
        SZ_QW:  0x08,

        BIG_ENDIAN    : 0x00,
        LITTLE_ENDIAN : 0x01
    };

    struct.uint8 = 0x01;
    struct.uint16= 0x02;
    struct.uint32= 0x04;
    struct.uint64= 0x08;

    /*
     # SZ_XX CONSTANT
     #@default 32 bits
     #@return int
    */
    struct.littleEndian = function ( _32b, size ){
        return size == struct.SZB_DB ? _32b&0xff :
            size == struct.SZB_WD ? ( _32b&0xff ) << 8 | ( ( _32b >> 8 )&0xff )&0xffff :
                size == struct.SZB_DW ? ( (_32b&0xff ) << 24 | ( ( _32b >> 8 )&0xff ) << 16 | ( ( _32b >> 16 )&0xff ) << 8 | (_32b>>24)&0xff )&0xffffffff :
                    struct.littleEndian( _32b, 32 );
    };

    /**/
    struct.getSizeType = function( $__number__ ){
        return $__number__ <= 0xFF ? struct.BYTE :
            $__number__ > 0xFF && $__number__ <= 0xFFFF ? struct.WORD :
                $__number__ > 0xFFFF && $__number__ <= 0xFFFFFFFF ? struct.DWORD :
                    $__number__ > 0xFFFFFFFF && $__number__ <= 0xFFFFFFFFFFFFFFFF ? struct.QWORD
                        : 0;
    };

    /*
     # like struct.exportType( window );
    */
    struct.exportType = function( hptr ){

        hptr.BYTE = hptr.uint8  = struct.BYTE;
        hptr.WORD = hptr.uint16 = struct.WORD;
        hptr.DWORD= hptr.uint32 = struct.DWORD;
        hptr.QWORD= hptr.uint64 = struct.QWORD;

        hptr.int8  = struct.int8;
        hptr.int16 = struct.int16;
        hptr.int32 = struct.int32;
        hptr.int364= struct.int64;
    };

    /*
     # int64
    */
    struct.makeQword = function( low, hight ){
        return ( (Math.pow( 2, 32 ) * hight) + (low&0xffffff) );
    }
    /**/


    struct.structException = function( i8e, msg, es ){
        this.errorno = i8e;
        this.msg     = msg;
        this.stack   = es;
    };
    struct.structException.prototype.getMessage = function( ){
        return "Struct generate an exception ["+(struct.structException.errc[this.errorno&0xf]||"not specified")+"] "+
            ", status code  #"+this.errorno+" : "+this.msg;
    };
    struct.structException.prototype.printMessage = function( ){
        console.log(
            this.getMessage()
        );
        return void 0;
    };
    struct.structException.prototype.getCode = function( ){
        return this.errorno;
    };
    struct.structException.errc = [
        "bufferIndexOfBoundsException",
        "overfowMemoryException",
        "criticalErrorReportException",
        "badCastException",
        "invalidAssignement"
    ];

    /*
     # ArrayExtend
    */
    Array.prototype.sum = function( ){
        var i =  sum = 0,
            len = this.length;
        try{
            for(; i < len; i++ )
                sum += typeof parseInt( this[ i ] ) === "number" ?
                    parseInt( this[ i ] )  : 0;;
        }catch(e){};
        return sum;
    };

    /*
     # unpack binaryStringBuffer
     # min 8 bits max 32 bits
     # try to review for 64 bits :/ not sur ...
     # not operationel because js don't support 64bits
     # 0x01020304 | 0x05060708 = 289,077,004,484,347,656
     # js return 289,077,004,484,347,650
     # console.log( 289077004484347656 ) === 0
     # impact on low part value 0x0000[ xx xx ] can be wrong !
     # so don't use it, slice your value like
     # 2 DWORD
     #
     # buffer  > binaryStringBuffer
	 # offset  > int offset starting
	 # ulen    > 1, 2, 4, 8, ||
     # len     > 17, 18, 20, 24
     # endian  > boolean type Endian BIG_ENDIAN OR LITTLE_ENDIAN
     #
     # @throw struct.structException
	 # @return integer
    */
    struct.__chr2int = function( buffer, off, len, endian ){
        var buffer = ( buffer || "" ),
            rol	   = len*8, ret = signed = 0,
            end	   = off+(len&0x0f),
            // bit64
            b64    = 0;

        signed = (len&0x10) >> 4;
        // -- 64 bits
        // cut of [ high, low ]
        if( (len&0x0f) > this.SZ_DW ){
            rol/=2;
            end/=2;
            b64 =1;
        }
        //  --
        try{
            for(; off < end; off++ ){

                buffer[ off ] ?
                    // review ret |= method
                    ( ret += ( 1 << (rol-=8) ) * buffer.charCodeAt( off ) )
                    // nop
                    : 0;
            }
            ret = ( endian || 0 ) ? struct.littleEndian(
                ret,
                len*8
            ) : ret;

        }catch(e){
            throw new struct.structException(
                0xBAD00,
                "buffer(`"+buffer+"`) break on offset ["+off+"] / "+end,
                e.stack
            );
        }
        //
        if( !signed && ret < 0 )
            ret = parseInt(
                base.dec2hext( ret, 4 ), 16
            );;

        // !!!!!! 64-BITS !!!!!!
        if( b64 ){
            // !! WARNING !!
            ret =  this.makeQword(
                this.__chr2int( buffer, off+4, this.DWORD, !1 ), // low
                ret // high
            );

            if( signed && ((ret&0xf0000000)>> 28) > -1 )
                ret &= 0xffffffff;
            signed = !1;
            // !! WARNING !!
        }
        // !!!!!! 64-BITS !!!!!!

        return signed ? ( ret << 24 ) >> 24 : ret;
    };
    /**/
    /*
     # pack binaryStringBuffer
     #
     # min 8 bits max 32 bits with bitwise method
     # review this for accept 64 bits method
    */
    struct.__int2chr = function( val, sizeof, endian ){
        var __trame__ = "",
            signed    = 0,
            b64 = 0,
            ror =  ( !sizeof ? this.getSizeType( val ) : sizeof ) * 8;

        if( val > Math.pow( 2 , ror )  )
            throw new struct.structException(
                0xBAD01,
                "you cannot move a numeric( "+val+" ) into "+struct.getSizeType(val)+
                " byte(s) "+(ror/8)+" byte(s) value",
                null
            );;

        if( val > Math.pow( 2 , this.SZB_DW ) ){
            b64 = ((val-(val&0xffffffff))/4294967296); // gethigh
            val = (val&0xffffffff)-1; // getLow
            ror/=2;
        }
        try{
            while( ror > 0 ){
                __trame__ += String.fromCharCode(
                    ( val >> (ror-=0x08) )&0xff
                );
            }

            if( endian )
                __trame__= __trame__.split("")
                    .reverse()
                    .join("");;

        }catch(e){
            throw new struct.structException(
                0xBAD00,
                "",
                e.stack
            );
        }

        // 64 bits
        if( b64 > 0 ){

            !endian ?
                (__trame__ = this.__int2chr(
                    b64, this.DWORD, endian
                ) + __trame__) :
                (__trame__ += this.__int2chr(
                    b64, this.DWORD, endian
                ));;

        }
        return __trame__;
    };

    /*
    # buffer = > "Ã¿", off => 0, size => { fb:3, sb:1, tb:2, ef:2 } or
    # buffer => "oÃ¿", off => 1, size =>....
    # @return { fb:7, sb:1, tb:3, eb:3 }
    */
    struct.__chr2bit = function( buffer, off, size ){
        var len = i = rol = 0, tmp,
            sizeof = [], data;

        size = ( size || {} );
        try{
            // look for size of
            // bit element
            for( tmp in size ){
                sizeof.push( size[ tmp ] );
                len += size[ tmp ];
            }

            // get buffer
            len += (len%2);
            data = this.__chr2int(
                buffer.substr(
                    off,
                    parseInt( len/8 ) == 0 ? 1 : parseInt( len/8 )
                ),
                0, parseInt( len/8 ) == 0 ? 1 : parseInt( len/8 )
            );
            // parse
            for( tmp in size){

                rol = sizeof.slice( i+1 )
                    .sum( );
                size[ tmp ] = ( data >> rol )&(Math.pow( 2, size[ tmp ] )-1);
                i++;
            }
            len = i = tmp = sizeof = data = null;
        }catch(e){

            msg  = "BAD TYPE"
            if( e instanceof structException )
                msg  = e.getMessag( );

            throw new struct.structException(
                e.errorno || 0xbad03,
                msg,
                e.stack
            );;
        }
        return size;
    };
    /*
    # val => { fb:7, sb:1, tb:3, eb:3 } , size => { fb:3, sb:1, tb:2, ef:2 }
    # @return "Ã¿"
    */
    struct.__bit2chr = function( val, size ){
        var __trame__ = "",tmp,
            n = ntmp = 0;
        try{
            for( tmp in size ){

                if( typeof val[ tmp ] === "string" )
                    throw new struct.structException(
                        0xbad04,
                        tmp+" invalid assignment from integer variable"
                    );;

                // check if exist
                val[ tmp ] = val[ tmp ] ?
                    val[ tmp ] : 0;

                if( val[ tmp ] >= 0 && val[ tmp ] < Math.pow( 2, ( size[ tmp ] ) ) ){

                    // overflow int 32 bit QWORD not supported
                    // alert( Math.pow( 2, ntmp += size[ tmp ] ) +" "+ Math.pow(2, DWORD * 8));
                    if( Math.pow( 2, ( ntmp += size[ tmp ] ) ) > Math.pow( 2, struct.DWORD * 8 ) ){

                        __trame__ += this.__int2chr(
                            n,
                            struct.DWORD
                        );
                        ntmp = n = 0;
                    }

                    n = ( n > 0 ) ? (( n << size[ tmp ] ) | val[ tmp ]) : val[ tmp ];
                }else
                    throw new struct.structException(
                        0xbad01,
                        tmp+" use only "+size[ tmp ]+" bit(s) in memory "
                    );;
            }
            __trame__  += this.__int2chr(
                n
            );
        }catch(e){
            throw new struct.structException(
                e.errorno ||Â 0xbad02,
                e.errorno ? e.getMessage( ) :
                    "<__bit2chr> drop in infinite loop"
        );
        }
        return __trame__;
    };
    /*
     # Buffer to Jstruct
     #
     # binary buffer, jstruct, Offset, endian
     # string	, JSON	 , int32 , Bool
     #
     # @return jstruct fully
    */
    struct.buffer2struct = function( buffer, struct, off, endian ){
        var off = ( off || 0 ),
            buffer = ( buffer ||"" ),
            toff,tmp, i,j;
        try{
            for( tmp in struct ){

                toff = 0;

                typeof struct[ tmp ] === "number" ?
                    (struct[ tmp ] = this.__chr2int(
                        buffer,		// buffer
                        off,		// offset
                        ( toff += struct[ tmp ] ), // len
                        endian || 0
                    ), toff &=0x0f ) : void 0;

                if( typeof struct[ tmp ] == "object"  && struct[ tmp ] !== null ){

                    toff = this.__sizeof( struct[ tmp ], 1 );
                    struct[ tmp ] = this.__chr2bit(
                        buffer,		// buffer
                        off,		// offset
                        struct[ tmp ]	// void * struct
                    );
                }

                // const char
                if( typeof struct[ tmp ] === "string" ){
                    var a,t,b,_off=0;

                    // ptr text len
                    // *structName->dword
                    if( ( t = (/^\*([\d\w_]+)(\-\>(dword|DWORD)|)$/).exec( struct[ tmp ] ) ) )
                        b = parseInt( struct[ t[1] ] );
                    // int
                    else
                        b = parseInt( struct[ tmp ] );;

                    i = off, j = isNaN( b ) ? -1 : 0,
                        a  = !isNaN( b ) ? b : 0 ;
                    struct[ tmp ] = "";

                    while( buffer[ i ] ){
                        // break on first null byte 0x00
                        if( ( buffer[i].charCodeAt(0) == 0x00 && j == -1 ) /* || ( j >= a ) */ ){
                            _off = buffer[i].charCodeAt(0) == 0x00 ? 1 : 0;
                            break;
                        }
                        // break with length
                        if( j >= a )
                            break;;

                        struct[ tmp ] += buffer[ i ];
                        j > -1 ? (j+=1) : void 0;
                        i++;
                    }
                    // By GROUP DWORD
                    if( t && t[3] && t[3].toUpperCase( ) === "DWORD" )
                        struct[ t[1] ] += (_off += (struct[ tmp ].length%4) > 0 ? 4-(struct[ tmp ].length%4) : 0 );;

                    toff = ( struct[ tmp ].length+_off );
                }
                /**/
                //ptr jstruct
                if( typeof struct[ tmp ] === "function" ){
                    var _ = 0;

                    toff = this.sizeof( (_=struct[ tmp ]( )) );
                    this.buffer2struct(
                        buffer,		// buffer
                        _,		// struct
                        off,		// offset
                        endian		// endian
                    );
                }

                off += toff;
                //console.log( base.dec2hex( off ) );
            }
        }catch(e){
            e.printMessage( );
            throw new struct.structException(
                e.errorno ||Â 0xbad02,
                e.errorno ? e.getMessage( ) :
                    "<buffer2struct> unknow error"
        );
        }
        return struct;
    };
    /**/
    /*
     # Jstruct to Binary buffer
     #
     # jstruct, *jstruct, buffer
     # JOSN	  , JSON    , String
     #
     # @return BinaryBuffer
    */
    struct.struct2buffer = function( _s, _ptrs, buffer ){
        var tmp,
            buffer = ( buffer || "" );
        try{
            for( tmp in _s ){

                typeof _s[ tmp ] === "number" ?
                    buffer += this.__int2chr(
                        _s[tmp],
                        _ptrs[ tmp ]
                    ) : void 0;

                typeof _s[ tmp ] === "string" ?
                    buffer += _s[ tmp ] : void 0;

                typeof _s[ tmp ] === "object" &&
                _s[ tmp ] !== null ?
                    buffer += this.__bit2chr(
                        _s[tmp],
                        _ptrs[tmp]
                    ) : void 0;

            }
        }catch(e){
            e.printMessage( );
            throw new struct.structException(
                e.errorno ||Â 0xbad02,
                e.errorno ? e.getMessage( ) :
                    "<struct2buffert> unknow error"
        );
        }

        return buffer;
    };
    /**/
    struct.__sizeof = function( struct, deep ){
        var tmp,size = 0;
        try{
            for( tmp in struct ){

                size += typeof struct[ tmp ] === "object" ?
                    this.sizeof(
                        struct[ tmp ],
                        1
                    ) :
                    typeof struct[tmp] === "function" ?
                        this.__sizeof( struct[tmp] ) :
                        typeof struct[ tmp ] === "number" && !deep ?
                            struct[ tmp ]&0x0f :
                            struct[ tmp ] === "number" && deep ?
                                struct[ tmp ] :
                                !isNaN( parseInt( struct[ tmp ] ) ) ?
                                    parseInt( struct[ tmp ] ) : 0;
            }
        }catch(e){};

        return ( deep ? size > 8 ? size/8 : 1 : size );
    };

    struct.sizeof = function( JStruct ){
        return typeof JStruct === "object" ?
            this.__sizeof( JStruct ) :
            0;
    };
    /***/
    /*Export*/
    window.struct = struct;

})( window || {} );

/*try{
	struct.exportType( window );
	console.log( struct.__bit2chr( { fb:7, sb:1, tb:3, eb:3 }, { fb:3, sb:1, tb:2, eb:2 } ));
}catch(e){
	e.printMessage();
}*/

/*
Example :

=-------------------------=
	TYPE
=-------------------------=
"\xff \xff \x00\x01 \x00\x01 \x02\x02\x02\x02"
foo = {
	bar_0:	uint8,
	bar_1:	int8,
	bar_3:	uint16,
	bar_4:	int16,
	bar_5:	uint32,
	bar_6:	int32
}; ->

bar_0:	255,
bar_1:	-1,
bar_3:	1,
bar_4:	1
bar_5:	33686018

=-------------------------=
	TEXT POINTER
=-------------------------=
\x00\x04 \x61\x61\x61\x61\x00
foo = {
	len:		WORD,
	payload:	""
}; ->

len:		4,
payload:	"aaaa" + byte NULL \x00

=-------------------------=
	TEXT Struct
=-------------------------=
\x00\x04\x61\x61\x61\x61
foo = {
	len:		WORD,
	payload:	"*len"
}; ->

len:		4,
payload:	"aaaa"

=-------------------------=
	TEXT Struct 32
=-------------------------=
\x00\x04 \x61\x61\x61\x61 \x62\xff\xff\xff \x03
foo = {
	len:		WORD,
	payload:	"*len->dword",

	end:		BYTE
}; ->

len:		5,
payload:	"aaaabÃ¿Ã¿Ã¿",
end:		3

=-------------------------=
	BITS
=-------------------------=
\x00\x04 \x61\x61\x61\x61 \x62\xff\xff\xff \x03 \x6A
foo = {
	len:		WORD,
	payload:	"*len->dword",

	end:		BYTE,

	// 3+2+2+1 = 8 bits =
	bit:{
		b0:3, b2:2, b3:2, b4:1
		}
}; ->

len:		5,
payload:	"aaaabÃ¿Ã¿Ã¿",
end:		3
bit:		{ b0: 2, b2: 1, b3: 3, b4: 0 }

*/