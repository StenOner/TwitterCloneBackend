'use strict'

const TweetCommentLike = require('../models/tweet_comment_like')

const controller = {
    newTweetCommentLike: (req, res) => {
        const tweetCommentLike = new TweetCommentLike()
        const body = req.body
        tweetCommentLike.tweetCommentID = body.tweetCommentID
        tweetCommentLike.profileID = body.profileID
        tweetCommentLike.createdAt = Date.now()
        tweetCommentLike.state = body.state
        tweetCommentLike.save((err, tweetCommentLikeSuccess) => {
            if (!tweetCommentLikeSuccess) return res.status(400).send({ message: 'No se pudo crear el like.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            tweetCommentLike.populate([{ path: 'tweetCommentID' }, { path: 'profileID' }], (err, tweetCommentLike) => {
                return res.status(200).send({ tweetCommentLike: tweetCommentLike, message: 'Like creado correctamente.' })
            })
        })
    },
    tweetCommentLike: (req, res) => {
        const tweetCommentLikeID = req.params.id
        TweetCommentLike.findById(tweetCommentLikeID, (err, tweetCommentLikeSuccess) => {
            if (!tweetCommentLikeSuccess) return res.status(400).send({ message: 'No existe el like.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentLike: tweetCommentLikeSuccess })
        })
            .populate([{ path: 'tweetCommentID' }, { path: 'profileID' }])
    },
    tweetCommentLikesByTweetCommentID: (req, res) => {
        const tweetCommentID = req.params.id
        TweetCommentLike.find({ tweetCommentID }, (err, tweetCommentLikesSuccess) => {
            if (!tweetCommentLikesSuccess) return res.status(400).send({ message: 'No hay likes para este comentario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentLikes: tweetCommentLikesSuccess })
        })
            .populate([{ path: 'tweetCommentID' }, { path: 'profileID' }])
            .sort({ createdAt: 'desc' })
    },
    tweetCommentLikesByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetCommentLike.find({ profileID }, (err, tweetCommentLikesSuccess) => {
            if (!tweetCommentLikesSuccess) return res.status(400).send({ message: 'No hay likes para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentLikes: tweetCommentLikesSuccess })
        })
            .populate([{ path: 'tweetCommentID' }, { path: 'profileID' }])
            .sort({ createdAt: 'desc' })
    },
    deleteTweetCommentLike: (req, res) => {
        const tweetCommentLikeID = req.params.id
        TweetCommentLike.findByIdAndDelete(tweetCommentLikeID, (err, tweetCommentLikeSuccess) => {
            if (!tweetCommentLikeSuccess) return res.status(400).send({ message: 'No existe el like.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentLike: tweetCommentLikeSuccess, message: 'Like eliminado correctamente.' })
        })
    },
    deleteTweetCommentLikesByTweetCommentID: (req, res) => {
        const tweetCommentID = req.params.id
        TweetCommentLike.deleteMany({ tweetCommentID }, (err, tweetCommentLikesSuccess) => {
            if (!tweetCommentLikesSuccess) return res.status(400).send({ message: 'No existen likes para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentLikes: tweetCommentLikesSuccess, message: 'Likes eliminados correctamente.' })
        })
    },
    deleteTweetCommentLikesByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetCommentLike.deleteMany({ profileID }, (err, tweetCommentLikesSuccess) => {
            if (!tweetCommentLikesSuccess) return res.status(400).send({ message: 'No existen likes para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentLikes: tweetCommentLikesSuccess, message: 'Likes eliminados correctamente.' })
        })
    },
}

module.exports = controller