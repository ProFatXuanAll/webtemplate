import EditPage from 'static/src/js/components/user/edit-page.js';
import WebLanguageUtils from 'static/src/js/utils/language.js';
import { host, } from 'settings/server/config.js';
import ValidateUtils from 'models/common/utils/validate.js';
import dynamicInputBlock from 'static/src/pug/components/user/dynamic-input-block.pug';
import LanguageUtils from 'models/common/utils/language.js';
import degreeUtils from 'models/faculty/utils/degree.js';
import { dataI18n, dataEditPageConfig, validationInfo, } from 'static/src/js/components/user/data-config.js';
import validate from 'validate.js';

class SetData {
    constructor ( opt ) {
        opt = opt || {};

        if (
            !ValidateUtils.isDomElement( opt.blockDOM ) ||
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
            addButton: opt.addButtonDOM,
        };

        this.selector = {
            check:  '.edit-page__window > .window__form > .form__button > .button__item--check',
            cancel: '.edit-page__window > .window__form > .form__button > .button__item--cancel',
            error:  '.edit-page__window > .window__form > .form__content > .content__error > .error__message',
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
                let content = '';
                [ res.school,
                    res.major,
                    degreeUtils.i18n[ this.config.languageId ][ degreeUtils.map[ res.degree ] ], ].forEach( ( element ) => {
                    if ( ValidateUtils.isValidString( element ) )
                        content += `${ element } `;
                } );
                await this.renderBlock( {
                    modifier: 'education',
                    id:       res.educationId,
                    content,
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
                let content = '';
                [ 'organization',
                    'department',
                    'title', ].forEach( ( element ) => {
                    if ( ValidateUtils.isValidString( res[ element ] ) )
                        content += `${ res[ element ] } `;
                } );
                await this.renderBlock( {
                    modifier: 'experience',
                    id:       res.experienceId,
                    content,
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
        document.body.removeChild( document.getElementById( 'edit-page' ) );
    }

    uploadUpdateData ( dbTableItemId ) {
        this.checkSubmitData();
        const editPageDOM = document.getElementById( 'edit-page' );
        const input = editPageDOM.getElementsByTagName( 'input' );
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
        const editPageDOM = document.getElementById( 'edit-page' );
        const input = editPageDOM.getElementsByTagName( 'input' );
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

    checkSubmitData () {
        let isValid = true;
        const editPageDOM = document.getElementById( 'edit-page' );
        const errorDOM = editPageDOM.querySelector( this.selector.error );
        const input = editPageDOM.getElementsByTagName( 'input' );

        const constraints = validationInfo[ this.config.dbTable ];

        Array.from( input ).forEach( ( element ) => {
            if ( constraints[ element.name ].presence.allowEmpty === false || element.value !== '' ) {
                const errors = validate.single( element.value, constraints[ element.name ] );
                if ( errors ) {
                    this.setErrorMessage( element, errors[ 0 ], errorDOM );
                    isValid = false;
                }
            }
        } );

        return isValid;
    }

    setErrorMessage ( inputDOM, errorMessage, errorDOM ) {
        inputDOM.focus();
        errorDOM.textContent = errorMessage;
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
            await editPage.renderEditPage();

            const editPageDOM = document.getElementById( 'edit-page' );
            const cancelDOM = editPageDOM.querySelector( this.selector.cancel );
            const checkDOM = editPageDOM.querySelector( this.selector.check );

            cancelDOM.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.closeEditPageWindow();
            } );
            checkDOM.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                const isValid = this.checkSubmitData();
                if ( isValid )
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
            await editPage.renderEditPage();
            const editPageDOM = document.getElementById( 'edit-page' );
            const cancelDOM = editPageDOM.querySelector( this.selector.cancel );
            const checkDOM = editPageDOM.querySelector( this.selector.check );

            cancelDOM.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.closeEditPageWindow();
            } );
            checkDOM.addEventListener( 'click', ( e ) => {
                e.preventDefault();

                const isValid = this.checkSubmitData();
                if ( isValid )
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
            await editPage.renderEditPage();

            const editPageDOM = document.getElementById( 'edit-page' );
            const cancelDOM = editPageDOM.querySelector( this.selector.cancel );
            const checkDOM = editPageDOM.querySelector( this.selector.check );

            cancelDOM.addEventListener( 'click', ( e ) => {
                e.preventDefault();
                this.closeEditPageWindow();
            } );
            checkDOM.addEventListener( 'click', ( e ) => {
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

        if ( !validate.isEmpty( data[ this.config.languageId ][ this.config.dbTable ] ) ) {
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
        }
        this.setAddButtonEvent();
    }
}

export {
    SetData,
};
