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
        var insertionMode            = 1,
            openElementsStack        = [],
            activeFormattingElements = []

        var INSERTION_MODES       = {
                'initial'       : 1,
                'beforeHtml'    : 2,
                'beforeHead'    : 3,
                'inHead'        : 4,
                'inHeadNoscript': 5
            },
            TOKEN_TYPE            = HTMLTokenizer.type,
            NODE_TYPE             = {
                ELEMENT_NODE               : 1,
                TEXT_NODE                  : 3,
                CDATA_SECTION_NODE         : 4,
                PROCESSING_INSTRUCTION_NODE: 7,
                COMMENT_NODE               : 8,
                DOCUMENT_NODE              : 9,
                DOCUMENT_TYPE_NODE         : 10,
                DOCUMENT_FRAGMENT_NODE     : 11
            },
            AMPERSAND             = '&',
            APOSTROPHE            = '\'',
            CARRIAGE_RETURN       = '\u000d',
            CHARACTER_TABULATION  = '\u0009',
            EQUALS                = '=',
            EXCLAMATION           = '!',
            FORM_FEED             = '\u000c',
            GREATER_THAN          = '>',
            HYPHEN_MINUS          = '-',
            LESS_THAN             = '<',
            LINE_FEED             = '\u000a',
            QUESTION              = '?',
            QUOTATION             = '"',
            RIGHT_SQUARE_BRACKET  = ']',
            SEMICOLON             = ';',
            SOLIDUS               = '/',
            SPACE                 = '\u0020',
            NULL                  = '\u0000',
            NUMBER_SIGN           = '#',
            REPLACEMENT_CHARACTER = '\ufffd',

            SMALL_X               = 'x',
            CAPITAL_X             = 'X',
            CDATA                 = '[CDATA[',
            DOCTYPE               = 'DOCTYPE',
            MISSING               = 'missing',
            ON                    = 'on',
            OFF                   = 'off',
            PUBLIC                = 'PUBLIC',
            SCRIPT                = 'script',
            SYSTEM                = 'SYSTEM'

        function Node( type ) {
            this.nodeType   = type
            this.childNodes = []
        }

        function constructTree( tokens ) {
            console.log( tokens )
            var i        = 0,
                len      = tokens.length,
                Document = new Node( NODE_TYPE.DOCUMENT_NODE ),
                curToken, curTokenType
            var count    = 0
            while ( i < len ) {
                if ( count++ > 20 ) {
                    break
                }
                curToken     = tokens[ i++ ]
                curTokenType = curToken.type

                switch ( insertionMode ) {
                case INSERTION_MODES.initial:
                    if (
                        curTokenType === TOKEN_TYPE.character &&
                        (
                            curToken.data === CHARACTER_TABULATION ||
                            curToken.data === LINE_FEED ||
                            curToken.data === FORM_FEED ||
                            curToken.data === CARRIAGE_RETURN ||
                            curToken.data === SPACE
                        )
                    ) {
                        break
                    } else if ( curTokenType === TOKEN_TYPE.comment ) {
                        var _comment  = new Node( NODE_TYPE.COMMENT_NODE )
                        _comment.data = curToken.data
                        Document.childNodes.push( _comment )
                    } else if ( curTokenType === TOKEN_TYPE.doctype ) {
                        if (
                            curToken.name !== 'html' ||
                            curToken.publicIdentifier !== MISSING ||
                            ( curToken.systemIdentifier !== MISSING && curToken.systemIdentifier !== 'about:legacy-compat')
                        ) {
                            //parse error
                        }

                        var _documentType      = new Node( NODE_TYPE.DOCUMENT_TYPE_NODE )
                        _documentType.name     = curToken.name === MISSING ? '' : curToken.name
                        _documentType.publicId = curToken.publicIdentifier === MISSING ? '' : curToken.publicIdentifier
                        _documentType.systemId = curToken.systemIdentifier === MISSING ? '' : curToken.systemIdentifier

                        Document.childNodes.push( _documentType )
                        Document.doctype = _documentType
                        //TODO
                        insertionMode    = INSERTION_MODES.beforeHtml
                    } else {
                        i--
                        insertionMode = INSERTION_MODES.beforeHtml
                    }

                    break

                case INSERTION_MODES.beforeHtml:
                    if ( curTokenType === TOKEN_TYPE.doctype ) {
                        break
                    } else if ( curTokenType === TOKEN_TYPE.comment ) {
                        var _comment  = new Node( NODE_TYPE.COMMENT_NODE )
                        _comment.data = curToken.data
                        Document.childNodes.push( _comment )
                    } else if (
                        curTokenType === TOKEN_TYPE.character &&
                        (
                            curToken.data === CHARACTER_TABULATION ||
                            curToken.data === LINE_FEED ||
                            curToken.data === FORM_FEED ||
                            curToken.data === CARRIAGE_RETURN ||
                            curToken.data === SPACE
                        )
                    ) {
                        break
                    } else if ( curTokenType === TOKEN_TYPE.startTag && curToken.tagName === 'html' ) {
                        var _html = new Node( NODE_TYPE.ELEMENT_NODE )
                        Document.childNodes.push( _html )
                        openElementsStack.push( _html )
                        insertionMode = INSERTION_MODES.beforeHead
                    } else if ( curTokenType === TOKEN_TYPE.endTag &&
                        curToken.tagName !== 'head' &&
                        curToken.tagName !== 'body' &&
                        curToken.tagName !== 'html' &&
                        curToken.tagName !== 'for'
                    ) {
                        break
                    } else {
                        var _html = new Node( NODE_TYPE.ELEMENT_NODE )
                        Document.childNodes.push( _html )
                        openElementsStack.push( _html )
                        insertionMode = INSERTION_MODES.beforeHead
                    }
                    break
                }
            }

            return Document

            function createElementForToken( token ) {

            }
        }

        return constructTree( HTMLTokenizer.tokenizer( html ) )
    }
} ))
