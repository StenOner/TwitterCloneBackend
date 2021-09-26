'use strict'

const TweetMediaContent = require('../models/tweet_media-content')

const controller = {
    newTweetMediaContent: (req, res) => {
        const tweetMediaContent = new TweetMediaContent()
        const body = req.body
        tweetMediaContent.tweetID = body.tweetID
        tweetMediaContent.content = ''
        tweetMediaContent.createdAt = Date.now()
        tweetMediaContent.state = body.state
        tweetMediaContent.save((err, tweetMediaContentSuccess) => {
            if (!tweetMediaContentSuccess) return res.status(400).send({ message: 'No se pudo crear contenido de media para el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediaContent: tweetMediaContentSuccess, message: 'Contenido de media creado correctamente.' })
        })
    },
    tweetMediaContent: (req, res) => {
        const tweetMediaContentID = req.params.id
        TweetMediaContent.findById(tweetMediaContentID, (err, tweetMediaContentSuccess) => {
            if (!tweetMediaContentSuccess) return res.status(400).send({ message: 'No existe contenido de media.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediaContent: tweetMediaContentSuccess })
        }).populate({ path: 'tweetID' })
    },
    tweetMediaContentsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetMediaContent.find({ tweetID }, (err, tweetMediaContentsSuccess) => {
            if (!tweetMediaContentsSuccess) return res.status(400).send({ message: 'No hay contenidos de media para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediaContents: tweetMediaContentsSuccess })
        }).populate({ path: 'tweetID' })
    },
    deleteTweetMediaContent: (req, res) => {
        const tweetMediaContentID = req.params.id
        TweetMediaContent.findByIdAndDelete(tweetMediaContentID, (err, tweetMediaContentSuccess) => {
            if (!tweetMediaContentSuccess) return res.status(400).send({ message: 'No existe contenido de media.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediaContent: tweetMediaContentSuccess, message: 'Contenido de media eliminado correctamente.' })
        })
    },
    deleteTweetMediaContentsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetMediaContent.deleteMany({ tweetID }, (err, tweetMediaContentsSuccess) => {
            if (!tweetMediaContentsSuccess) return res.status(400).send({ message: 'No existen contenidos de media para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediaContents: tweetMediaContentsSuccess, message: 'Contenidos de media eliminados correctamente.' })
        })
    },
}

module.exports = controller