import EditPage from 'static/src/js/components/user/edit-page.js';
import WebLanguageUtils from 'static/src/js/utils/language.js';
import { classAdd, } from 'static/src/js/utils/style.js';
import { host, } from 'settings/server/config.js';
import ValidateUtils from 'models/common/utils/validate.js';
import dynamicInputBlock from 'static/src/pug/components/user/dynamic-input-block.pug';
import LanguageUtils from 'models/common/utils/language.js';
import degreeUtils from 'models/faculty/utils/degree.js';
import { dataI18n, dataEditPageConfig, } from 'static/src/js/components/user/data-config.js';

class SetData {
    constructor ( opt ) {
        opt = opt || {};

        if (
            !ValidateUtils.isDomElement( opt.blockDOM ) ||
            !ValidateUtils.isDomElement( opt.editPageDOM ) ||
            !ValidateUtils.isDomElement( opt.addButtonDOM ) ||
            !WebLanguageUtils.isSupportedLanguageId( opt.languageId )
        )
            throw new TypeError( 'invalid arguments' );

        this.config = {
            languageId: opt.languageId,
            profileId:  opt.profileId,
            dbTable:    opt.dbTable,
        };

        this.i18n = dataI18n[ opt.dbTable ];

        this.DOM = {
            block:     opt.blockDOM,
            editPage:  opt.editPageDOM,
            addButton: opt.addButtonDOM,
        };

        this.updateButtonQuerySelector = ( block, id ) => `.input-block__block > .block__content > .content__modify--${ block }-${ id }`;
        this.deleteButtonQuerySelector = ( block, id ) => `.input-block__block > .block__content > .content__remove--${ block }-${ id }`;

        this.editPageConfig = dataEditPageConfig[ opt.dbTable ];
    }

    queryApi ( lang ) {
        return `${ host }/api/faculty/facultyWithId/${ this.config.profileId }?languageId=${ lang }`;
    }

    async fetchData ( lang ) {
        try {
            const res = await fetch( this.queryApi( lang ) );

            if ( !res.ok )
                throw new Error( 'No faculty found' );

            return res.json();
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderBlock ( info ) {
        try {
            const buttonI18n = dataI18n.button;
            const data = {
                info,
                button:   {
                    remove: buttonI18n[ this.config.languageId ].delete,
                    modify: buttonI18n[ this.config.languageId ].update,
                },
            };
            this.DOM.block.innerHTML += dynamicInputBlock( {
                data,
            } );
        }
        catch ( err ) {
            console.error( err );
        }
    }

    async renderEducationBlock ( data ) {
        try {
            this.DOM.block.innerHTML = '';
            data[ this.config.languageId ][ this.config.dbTable ].forEach( async ( res, index ) => {
                await this.renderBlock( {
                    modifier: 'education',
                    id:       res.educationId,
                    content:  `${ res.school } ${ res.major } ${ degreeUtils.i18n[ this.config.languageId ][ degreeUtils.map[ res.degree ] ] }`,
                    res:      {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ].education[ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ].education[ index ],
                    },
                } );
                await this.setUpdateButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.updateButtonQuerySelector( this.config.dbTable, res.educationId ) ),
                    res:       {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                    id:       res.educationId,
                } );
                await this.setDeleteButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.deleteButtonQuerySelector( this.config.dbTable, res.educationId ) ),
                    id:        res.educationId,
                    content:   `${ res.school } ${ res.major } ${ degreeUtils.i18n[ this.config.languageId ][ degreeUtils.map[ res.degree ] ] }`,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderExperienceBlock ( data ) {
        try {
            this.DOM.block.innerHTML = '';
            data[ this.config.languageId ][ this.config.dbTable ].forEach( async ( res, index ) => {
                await this.renderBlock( {
                    modifier: 'experience',
                    id:       res.experienceId,
                    content:  `${ res.organization } ${ res.department } ${ res.title }`,
                    res:      {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                } );
                await this.setUpdateButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.updateButtonQuerySelector( this.config.dbTable, res.experienceId ) ),
                    res:       {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                    id:       res.experienceId,
                } );
                await this.setDeleteButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.deleteButtonQuerySelector( this.config.dbTable, res.experienceId ) ),
                    id:        res.experienceId,
                    content:   `${ res.organization } ${ res.department } ${ res.title }`,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderTitleBlock ( data ) {
        try {
            this.DOM.block.innerHTML = '';
            data[ this.config.languageId ][ this.config.dbTable ].forEach( async ( res, index ) => {
                await this.renderBlock( {
                    modifier: 'title',
                    id:       res.titleId,
                    content:  res.title,
                    res:      {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                } );
                await this.setUpdateButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.updateButtonQuerySelector( this.config.dbTable, res.titleId ) ),
                    res:       {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                    id:       res.titleId,
                } );
                await this.setDeleteButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.deleteButtonQuerySelector( this.config.dbTable, res.titleId ) ),
                    id:        res.titleId,
                    content:   res.title,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderSpecialtyBlock ( data ) {
        try {
            this.DOM.block.innerHTML = '';
            data[ this.config.languageId ][ this.config.dbTable ].forEach( async ( res, index ) => {
                await this.renderBlock( {
                    modifier: 'specialty',
                    id:       res.specialtyId,
                    content:  res.specialty,
                    res:      {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                } );
                await this.setUpdateButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.updateButtonQuerySelector( this.config.dbTable, res.specialtyId ) ),
                    res:       {
                        [ LanguageUtils.getLanguageId( 'en-US' ) ]: data[ LanguageUtils.getLanguageId( 'en-US' ) ][ this.config.dbTable ][ index ],
                        [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: data[ LanguageUtils.getLanguageId( 'zh-TW' ) ][ this.config.dbTable ][ index ],
                    },
                    id:       res.specialtyId,
                } );
                await this.setDeleteButtonEvent( {
                    buttonDOM: this.DOM.block.querySelector( this.deleteButtonQuerySelector( this.config.dbTable, res.specialtyId ) ),
                    id:        res.specialtyId,
                    content:   res.specialty,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    closeEditPageWindow () {
        classAdd( this.DOM.editPage, 'content__edit-page--hidden' );
    }

    uploadUpdateData ( dbTableItemId ) {
        const input = this.DOM.editPage.getElementsByTagName( 'input' );
        const item = {};
        const i18n = {
            [ LanguageUtils.getLanguageId( 'en-US' ) ]: {},
            [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: {},
        };
        Array.from( input ).forEach( ( element ) => {
            if ( element.getAttribute( 'type' ) === 'text' && element.getAttribute( 'i18n' ) !== null )
                i18n[ element.getAttribute( 'languageId' ) ][ element.getAttribute( 'dbTableItem' ) ] = element.value;
            else
                item[ element.getAttribute( 'dbTableItem' ) ] = element.value;
        } );

        fetch( `${ host }/user/profile`, {
            method:   'POST',
            body:   JSON.stringify( {
                'profileId':    this.config.profileId,
                'method':       'update',
                'dbTable':      this.config.dbTable,
                dbTableItemId,
                item,
                i18n,
            } ),
        } )
        .then( async () => {
            this.exec();
            this.closeEditPageWindow();
        } ).catch( ( err ) => {
            this.closeEditPageWindow();
            console.error( err );
        } );
    }

    uploadAddData () {
        const input = this.DOM.editPage.getElementsByTagName( 'input' );
        const item = {};
        const i18n = {
            [ LanguageUtils.getLanguageId( 'en-US' ) ]: {},
            [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: {},
        };
        Array.from( input ).forEach( ( element ) => {
            if ( element.getAttribute( 'type' ) === 'text' && element.getAttribute( 'i18n' ) !== null )
                i18n[ element.getAttribute( 'languageId' ) ][ element.getAttribute( 'dbTableItem' ) ] = element.value;
            else
                item[ element.getAttribute( 'dbTableItem' ) ] = element.value;
        } );

        fetch( `${ host }/user/profile`, {
            method:   'POST',
            body:   JSON.stringify( {
                profileId:    this.config.profileId,
                method:       'add',
                dbTable:      this.config.dbTable,
                item,
                i18n,
            } ),
        } )
        .then( async () => {
            this.exec();
            this.closeEditPageWindow();
        } ).catch( ( err ) => {
            this.closeEditPageWindow();
            console.error( err );
        } );
    }

    uploadDeleteData ( dbTableItemId ) {
        fetch( `${ host }/user/profile`, {
            method:   'POST',
            body:   JSON.stringify( {
                profileId:     this.config.profileId,
                method:        'delete',
                dbTable:       this.config.dbTable,
                dbTableItemId,
            } ),
        } )
        .then( async () => {
            this.exec();
            this.closeEditPageWindow();
        } ).catch( ( err ) => {
            this.closeEditPageWindow();
            console.error( err );
        } );
    }

    checkSubmitData ( inputDOM ) {
        const isValid = true;
        Array.from( inputDOM ).forEach( ( element ) => {
            if ( element.getAttribute( required ) !== null ) {
                if ( !ValidateUtils.isValidString( element.value ) ) {
                    element.focus();
                    return '此欄位不可為空';
                }
            }
        } );

        return true;
    }

    setAddButtonEvent () {
        this.DOM.addButton.addEventListener( 'click', async () => {
            const editPage = new EditPage( {
                editPageConfig: dataEditPageConfig[ this.config.dbTable ],
                dataI18n:       dataI18n[ this.config.dbTable ],
                editPageDOM:    this.DOM.editPage,
                dbTable:        this.config.dbTable,
                languageId:     this.config.languageId,
                buttonMethod:   'add',
            } );
            const editPageDOM = await editPage.renderEditPage();

            editPageDOM.cancel.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.closeEditPageWindow();
            } );
            editPageDOM.check.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.uploadAddData();
            } );
        } );
    }

    setUpdateButtonEvent ( info ) {
        info.buttonDOM.addEventListener( 'click', async () => {
            const editPage = new EditPage( {
                editPageConfig: dataEditPageConfig[ this.config.dbTable ],
                dataI18n:       dataI18n[ this.config.dbTable ],
                editPageDOM:    this.DOM.editPage,
                dbTable:        this.config.dbTable,
                languageId:     this.config.languageId,
                dbData:         info.res,
                buttonMethod:   'update',
            } );
            const editPageDOM = await editPage.renderEditPage();

            editPageDOM.cancel.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.closeEditPageWindow();
            } );
            editPageDOM.check.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.uploadUpdateData( info.id );
            } );
        } );
    }

    setDeleteButtonEvent ( info ) {
        info.buttonDOM.addEventListener( 'click', async () => {
            const editPage = new EditPage( {
                dataI18n:       dataI18n[ this.config.dbTable ],
                editPageConfig: dataEditPageConfig[ this.config.dbTable ],
                editPageDOM:    this.DOM.editPage,
                dbTable:        this.config.dbTable,
                languageId:     this.config.languageId,
                id:             info.id,
                content:        info.content,
                buttonMethod:   'delete',
            } );
            const editPageDOM = await editPage.renderEditPage();

            editPageDOM.cancel.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.closeEditPageWindow();
            } );
            editPageDOM.check.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.uploadDeleteData( info.id );
            } );
        } );
    }

    async exec () {
        const data = {
            [ LanguageUtils.getLanguageId( 'en-US' ) ]: await this.fetchData( LanguageUtils.getLanguageId( 'en-US' ) ),
            [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: await this.fetchData( LanguageUtils.getLanguageId( 'zh-TW' ) ),
        };

        switch ( this.config.dbTable ) {
            case 'education':
                await this.renderEducationBlock( data );
                break;
            case 'experience':
                await this.renderExperienceBlock( data );
                break;
            case 'title':
                await this.renderTitleBlock( data );
                break;
            case 'specialty':
                await this.renderSpecialtyBlock( data );
                break;
            default:
                break;
        }
        this.setAddButtonEvent();
    }
}

export {
    SetData,
};
