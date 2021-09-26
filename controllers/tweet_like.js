'use strict'

const TweetLike = require('../models/tweet_like')

const controller = {
    newTweetLike: (req, res) => {
        const tweetLike = new TweetLike()
        const body = req.body
        tweetLike.tweetID = body.tweetID
        tweetLike.profileID = body.profileID
        tweetLike.createdAt = Date.now()
        tweetLike.state = body.state
        tweetLike.save((err, tweetLikeSuccess) => {
            if (!tweetLikeSuccess) return res.status(400).send({ message: 'No se pudo crear el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLike: tweetLikeSuccess, message: 'Like creado correctamente.' })
        })
    },
    tweetLike: (req, res) => {
        const tweetLikeID = req.params.id
        TweetLike.findById(tweetLikeID, (err, tweetLikeSuccess) => {
            if (!tweetLikeSuccess) return res.status(400).send({ message: 'No existe el like.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLike: tweetLikeSuccess })
        }).populate({ path: 'tweetID' }).populate({ path: 'profileID' })
    },
    tweetLikesByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetLike.find({ tweetID }, (err, tweetLikesSuccess) => {
            if (!tweetLikesSuccess) return res.status(400).send({ message: 'No hay likes para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLikes: tweetLikesSuccess })
        }).populate({ path: 'tweetID' }).populate({ path: 'profileID' })
    },
    tweetLikesByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetLike.find({ profileID }, (err, tweetLikesSuccess) => {
            if (!tweetLikesSuccess) return res.status(400).send({ message: 'No hay likes para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLikes: tweetLikesSuccess })
        }).populate({ path: 'tweetID' }).populate({ path: 'profileID' })
    },
    deleteTweetLike: (req, res) => {
        const tweetLikeID = req.params.id
        TweetLike.findByIdAndDelete(tweetLikeID, (err, tweetLikeSuccess) => {
            if (!tweetLikeSuccess) return res.status(400).send({ message: 'No existe el like.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLike: tweetLikeSuccess, message: 'Like eliminado correctamente.' })
        })
    },
    deleteTweetLikesByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetLike.deleteMany({ tweetID }, (err, tweetLikesSuccess) => {
            if (!tweetLikesSuccess) return res.status(400).send({ message: 'No existen likes para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLikes: tweetLikesSuccess, message: 'Likes eliminados correctamente.' })
        })
    },
    deleteTweetLikesByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetLike.deleteMany({ profileID }, (err, tweetLikesSuccess) => {
            if (!tweetLikesSuccess) return res.status(400).send({ message: 'No existen likes para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetLikes: tweetLikesSuccess, message: 'Likes eliminados correctamente.' })
        })
    },
}

module.exports = controller