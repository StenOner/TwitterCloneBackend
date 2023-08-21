'use strict'

const TweetCommentMediacontent = require('../models/tweet_comment_mediacontent')

const controller = {
    newTweetCommentMediacontent: (req, res) => {
        const tweetCommentMediacontent = new TweetCommentMediacontent()
        const body = req.body
        tweetCommentMediacontent.tweetCommentID = body.tweetCommentID
        tweetCommentMediacontent.content = null
        tweetCommentMediacontent.createdAt = Date.now()
        tweetCommentMediacontent.state = body.state
        tweetCommentMediacontent.save((err, tweetCommentMediacontentSuccess) => {
            if (!tweetCommentMediacontentSuccess) return res.status(400).send({ message: 'No se pudo crear contenido de media para el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            tweetCommentMediacontent.populate({ path: 'tweetID' }, (err, tweetCommentMediacontent) => {
                return res.status(200).send({ tweetCommentMediacontent: tweetCommentMediacontent, message: 'Contenido de media creado correctamente.' })
            })
        })
    },
    tweetCommentMediacontent: (req, res) => {
        const tweetCommentMediacontentID = req.params.id
        TweetCommentMediacontent.findById(tweetCommentMediacontentID, (err, tweetCommentMediacontentSuccess) => {
            if (!tweetCommentMediacontentSuccess) return res.status(400).send({ message: 'No existe contenido de media.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentMediacontent: tweetCommentMediacontentSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    tweetCommentMediacontentsByTweetCommentID: (req, res) => {
        const tweetCommentID = req.params.id
        TweetCommentMediacontent.find({ tweetCommentID }, (err, tweetCommentMediacontentsSuccess) => {
            if (!tweetCommentMediacontentsSuccess) return res.status(400).send({ message: 'No hay contenidos de media para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentMediacontents: tweetCommentMediacontentsSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    deleteTweetCommentMediacontent: (req, res) => {
        const tweetCommentMediacontentID = req.params.id
        TweetCommentMediacontent.findByIdAndDelete(tweetCommentMediacontentID, (err, tweetCommentMediacontentSuccess) => {
            if (!tweetCommentMediacontentSuccess) return res.status(400).send({ message: 'No existe contenido de media.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentMediacontent: tweetCommentMediacontentSuccess, message: 'Contenido de media eliminado correctamente.' })
        })
    },
    deleteTweetCommentMediacontentsByTweetCommentID: (req, res) => {
        const tweetCommentID = req.params.id
        TweetCommentMediacontent.deleteMany({ tweetCommentID }, (err, tweetCommentMediacontentsSuccess) => {
            if (!tweetCommentMediacontentsSuccess) return res.status(400).send({ message: 'No existen contenidos de media para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetCommentMediacontents: tweetCommentMediacontentsSuccess, message: 'Contenidos de media eliminados correctamente.' })
        })
    },
}

module.exports = controller