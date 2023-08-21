'use strict'

const TweetMediacontent = require('../models/tweet_mediacontent')

const controller = {
    newTweetMediacontent: (req, res) => {
        const tweetMediacontent = new TweetMediacontent()
        const body = req.body
        tweetMediacontent.tweetID = body.tweetID
        tweetMediacontent.content = null
        tweetMediacontent.createdAt = Date.now()
        tweetMediacontent.state = body.state
        tweetMediacontent.save((err, tweetMediacontentSuccess) => {
            if (!tweetMediacontentSuccess) return res.status(400).send({ message: 'No se pudo crear contenido de media para el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            tweetMediacontent.populate({ path: 'tweetID' }, (err, tweetMediacontent) => {
                return res.status(200).send({ tweetMediacontent: tweetMediacontent, message: 'Contenido de media creado correctamente.' })
            })
        })
    },
    tweetMediacontent: (req, res) => {
        const tweetMediacontentID = req.params.id
        TweetMediacontent.findById(tweetMediacontentID, (err, tweetMediacontentSuccess) => {
            if (!tweetMediacontentSuccess) return res.status(400).send({ message: 'No existe contenido de media.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediacontent: tweetMediacontentSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    tweetMediacontentsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetMediacontent.find({ tweetID }, (err, tweetMediacontentsSuccess) => {
            if (!tweetMediacontentsSuccess) return res.status(400).send({ message: 'No hay contenidos de media para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediacontents: tweetMediacontentsSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    deleteTweetMediacontent: (req, res) => {
        const tweetMediacontentID = req.params.id
        TweetMediacontent.findByIdAndDelete(tweetMediacontentID, (err, tweetMediacontentSuccess) => {
            if (!tweetMediacontentSuccess) return res.status(400).send({ message: 'No existe contenido de media.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediacontent: tweetMediacontentSuccess, message: 'Contenido de media eliminado correctamente.' })
        })
    },
    deleteTweetMediacontentsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetMediacontent.deleteMany({ tweetID }, (err, tweetMediacontentsSuccess) => {
            if (!tweetMediacontentsSuccess) return res.status(400).send({ message: 'No existen contenidos de media para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMediacontents: tweetMediacontentsSuccess, message: 'Contenidos de media eliminados correctamente.' })
        })
    },
}

module.exports = controller