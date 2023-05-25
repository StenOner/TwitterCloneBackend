'use strict'

const TweetBookmark = require('../models/tweet_bookmark')

const controller = {
    newTweetBookmark: (req, res) => {
        const tweetBookmark = new TweetBookmark()
        const body = req.body
        tweetBookmark.tweetID = body.tweetID
        tweetBookmark.profileID = body.profileID
        tweetBookmark.createdAt = Date.now()
        tweetBookmark.state = body.state
        tweetBookmark.save((err, tweetBookmarkSuccess) => {
            if (!tweetBookmarkSuccess) return res.status(400).send({ message: 'No se pudo crear la marca de libro.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            tweetBookmark.populate([{ path: 'tweetID' }, { path: 'profileID' }], (err, tweetBookmark) => {
                return res.status(200).send({ tweetBookmark: tweetBookmark, message: 'Marca de libro creada correctamente.' })
            })
        })
    },
    tweetBookmark: (req, res) => {
        const tweetBookmarkID = req.params.id
        TweetBookmark.findById(tweetBookmarkID, (err, tweetBookmarkSuccess) => {
            if (!tweetBookmarkSuccess) return res.status(400).send({ message: 'No existe la marca de libro.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetBookmark: tweetBookmarkSuccess })
        })
            .populate([{
                path: 'tweetID', populate: [{
                    path: 'tweetReplyOptionID',
                }, {
                    path: 'profileID'
                }]
            }, { path: 'profileID' }])
    },
    tweetBookmarksByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetBookmark.find({ tweetID }, (err, tweetBookmarksSuccess) => {
            if (!tweetBookmarksSuccess) return res.status(400).send({ message: 'No hay marcas de libro para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetBookmarks: tweetBookmarksSuccess })
        })
            .populate([{
                path: 'tweetID', populate: [{
                    path: 'tweetReplyOptionID',
                }, {
                    path: 'profileID'
                }]
            }, { path: 'profileID' }])
            .sort({ createdAt: 'desc' })
    },
    tweetBookmarksByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetBookmark.find({ profileID }, (err, tweetBookmarksSuccess) => {
            if (!tweetBookmarksSuccess) return res.status(400).send({ message: 'No hay marcas de libro para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetBookmarks: tweetBookmarksSuccess })
        })
            .populate([{
                path: 'tweetID', populate: [{
                    path: 'tweetReplyOptionID',
                }, {
                    path: 'profileID'
                }]
            }, { path: 'profileID' }])
            .sort({ createdAt: 'desc' })
    },
    deleteTweetBookmark: (req, res) => {
        const tweetBookmarkID = req.params.id
        TweetBookmark.findByIdAndDelete(tweetBookmarkID, (err, tweetBookmarkSuccess) => {
            if (!tweetBookmarkSuccess) return res.status(400).send({ message: 'No existe la marca de libro.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetBookmark: tweetBookmarkSuccess, message: 'Marca de libro eliminada correctamente.' })
        })
    },
    deleteTweetBookmarksByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetBookmark.deleteMany({ tweetID }, (err, tweetBookmarksSuccess) => {
            if (!tweetBookmarksSuccess) return res.status(400).send({ message: 'No existen marcas de libro para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetBookmarks: tweetBookmarksSuccess, message: 'Marcas de libro eliminadas correctamente.' })
        })
    },
    deleteTweetBookmarksByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetBookmark.deleteMany({ profileID }, (err, tweetBookmarksSuccess) => {
            if (!tweetBookmarksSuccess) return res.status(400).send({ message: 'No existen marcas de libro para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetBookmarks: tweetBookmarksSuccess, message: 'Marcas de libro eliminadas correctamente.' })
        })
    },
}

module.exports = controller