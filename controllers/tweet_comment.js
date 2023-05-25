'use strict'

const TweetComment = require('../models/tweet_comment')

const controller = {
    newTweetComment: (req, res) => {
        const tweetComment = new TweetComment()
        const body = req.body
        tweetComment.tweetID = body.tweetID
        tweetComment.profileID = body.profileID
        tweetComment.content = body.content
        tweetComment.createdAt = Date.now()
        tweetComment.state = body.state
        tweetComment.save((err, tweetCommentSuccess) => {
            if (!tweetCommentSuccess) return res.status(400).send({ message: 'No se pudo crear el comentario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            tweetComment.populate([{ path: 'tweetID' }, { path: 'profileID' }], (err, tweetComment) => {
                return res.status(200).send({ tweetComment: tweetComment, message: 'Comentario creado correctamente.' })
            })
        })
    },
    tweetComment: (req, res) => {
        const tweetCommentID = req.params.id
        TweetComment.findById(tweetCommentID, (err, tweetCommentSuccess) => {
            if (!tweetCommentSuccess) return res.status(400).send({ message: 'No existe el comentario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetComment: tweetCommentSuccess })
        })
            .populate([{ path: 'tweetID' }, { path: 'profileID' }])
    },
    tweetCommentsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetComment.find({ tweetID }, (err, tweetCommentsSuccess) => {
            if (!tweetCommentsSuccess) return res.status(400).send({ message: 'No existen comentarios para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetComments: tweetCommentsSuccess })
        })
            .populate([{ path: 'tweetID' }, { path: 'profileID' }])
            .sort({ createdAt: 'desc' })
    },
    tweetCommentsByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetComment.find({ profileID }, (err, tweetCommentsSuccess) => {
            if (!tweetCommentsSuccess) return res.status(400).send({ message: 'No existen comentarios para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetComments: tweetCommentsSuccess })
        })
            .populate([{ path: 'tweetID' }, { path: 'profileID' }])
            .sort({ createdAt: 'desc' })
    },
    deleteTweetComment: (req, res) => {
        const tweetCommentID = req.params.id
        TweetComment.findByIdAndDelete(tweetCommentID, (err, tweetCommentSuccess) => {
            if (!tweetCommentSuccess) return res.status(400).send({ message: 'No existe el comentario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetComment: tweetCommentSuccess, message: 'Comentario eliminado correctamente.' })
        })
    },
    deleteTweetCommentsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetComment.deleteMany({ tweetID }, (err, tweetCommentsSuccess) => {
            if (!tweetCommentsSuccess) return res.status(400).send({ message: 'No existen comentarios.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetComments: tweetCommentsSuccess, message: 'Comentarios eliminados correctamente.' })
        })
    },
    deleteTweetCommentsByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetComment.deleteMany({ profileID }, (err, tweetCommentsSuccess) => {
            if (!tweetCommentsSuccess) return res.status(400).send({ message: 'No existen comentarios.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetComments: tweetCommentsSuccess, message: 'Comentarios eliminados correctamente.' })
        })
    },
}

module.exports = controller