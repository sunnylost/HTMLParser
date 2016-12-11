(function ( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( [ 'HTMLNamedCharacterReferences' ], factory )
    } else if ( typeof module === 'object' && module.exports ) {
        module.exports = factory( require( './HTMLTokenizer' ) )
    } else {
        root.HTMLParser = factory( root.HTMLTokenizer )
    }
}( this, function ( HTMLTokenizer ) {
    return function ( html ) {
        //TODO
        return HTMLTokenizer( html )
    }
} ))
