/**
 * API router middleware module for `/api/announcement`.
 *
 * Including following sub-routing modules:
 * - `/api/announcement/get-announcements-by-and-tags`
 * - `/api/announcement/get-announcements-by-or-tags`
 * - `/api/announcement/get-pinned-announcements-by-and-tags`
 * - `/api/announcement/get-pinned-announcements-by-or-tags`
 * - `/api/announcement/get-pages-by-and-tags`
 * - `/api/announcement/get-pages-by-or-tags`
 * - `/api/announcement/get-hot-announcements`
 * - `/api/announcement/get-tv-announcements`
 * - `/api/announcement/[id]`
 */

import express from 'express';

import getAnnouncementsByAndTags from 'models/announcement/operations/get-announcements-by-and-tags.js';
import getAnnouncementsByOrTags from 'models/announcement/operations/get-announcements-by-or-tags.js';
import getPinnedAnnouncementsByAndTags from 'models/announcement/operations/get-pinned-announcements-by-and-tags.js';
import getPinnedAnnouncementsByOrTags from 'models/announcement/operations/get-pinned-announcements-by-or-tags.js';
import getPagesByAndTags from '../models/announcement/operations/get-pages-by-and-tags';
import getPagesByOrTags from 'models/announcement/operations/get-pages-by-or-tags.js';
import getHotAnnouncements from 'models/announcement/operations/get-hot-announcements.js';
import getTvAnnouncements from 'models/announcement/operations/get-tv-announcements.js';
import getAnnouncement from 'models/announcement/operations/get-announcement.js';

const apis = express.Router();

/**
 * Resolve URL `/api/announcement/get-announcements-by-and-tags`.
 */

apis.get( '/get-announcements-by-and-tags', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getAnnouncementsByAndTags( {
            amount:   Number( req.query.amount ),
            from:     new Date( Number( req.query.from ) ),
            language: Number( req.query.languageId ),
            page:     Number( req.query.page ),
            tags,
            to:       new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-announcements-by-or-tags`.
 */

apis.get( '/get-announcements-by-or-tags', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getAnnouncementsByOrTags( {
            amount:   Number( req.query.amount ),
            from:     new Date( Number( req.query.from ) ),
            language: Number( req.query.languageId ),
            page:     Number( req.query.page ),
            tags,
            to:       new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-pinned-announcements-by-and-tags`.
 */

apis.get( '/get-pinned-announcements-by-and-tags', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getPinnedAnnouncementsByAndTags( {
            from:     new Date( Number( req.query.from ) ),
            language: Number( req.query.languageId ),
            tags,
            to:       new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-pinned-announcements-by-or-tags`.
 */

apis.get( '/get-pinned-announcements-by-or-tags', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getPinnedAnnouncementsByOrTags( {
            from:     new Date( Number( req.query.from ) ),
            language: Number( req.query.languageId ),
            tags,
            to:       new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-pages-by-and-tags`.
 */

apis.get( '/get-pages-by-and-tags', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getPagesByAndTags( {
            amount: Number( req.query.amount ),
            from:   new Date( Number( req.query.from ) ),
            tags,
            to:     new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-pages-by-or-tags`.
 */

apis.get( '/get-pages-by-or-tags', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getPagesByOrTags( {
            amount: Number( req.query.amount ),
            from:   new Date( Number( req.query.from ) ),
            tags,
            to:     new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-hot-announcements`.
 */

apis.get( '/get-hot-announcements', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getHotAnnouncements( {
            amount:   Number( req.query.amount ),
            from:     new Date( Number( req.query.from ) ),
            language: Number( req.query.languageId ),
            page:     Number( req.query.page ),
            tags,
            to:       new Date( Number( req.query.to ) ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/get-tv-announcements`.
 */

apis.get( '/get-tv-announcements', async ( req, res, next ) => {
    try {
        let tags = req.query.tags || [];
        if ( !Array.isArray( tags ) )
            tags = [ tags, ];
        tags = tags.map( Number );

        res.json( await getTvAnnouncements( {
            amount:   Number( req.query.amount ),
            language: Number( req.query.languageId ),
            tags,
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

/**
 * Resolve URL `/api/announcement/[id]`.
 */

apis.get( '/:announcementId', async ( req, res, next ) => {
    try {
        res.json( await getAnnouncement( {
            announcementId: Number( req.params.announcementId ),
            language:       Number( req.query.languageId ),
        } ) );
    }
    catch ( error ) {
        next( error );
    }
} );

export default apis;