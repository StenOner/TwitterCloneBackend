'use strict'

const TweetReplyOption = require('../models/tweet_reply_option')

const controller = {
    TweetReplyOption: (req, res) => {
        const tweetReplyOptionID = req.params.id
        TweetReplyOption.findById(tweetReplyOptionID, (err, tweetReplyOptionSuccess) => {
            if (!tweetReplyOptionSuccess) return res.status(400).send({ message: 'No existe la opcion.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetReplyOption: tweetReplyOptionSuccess })
        })
    },
    TweetReplyOptions: (req, res) => {
        TweetReplyOption.find({ state: true }, (err, tweetReplyOptionsSuccess) => {
            if (!tweetReplyOptionsSuccess) return res.status(400).send({ message: 'No hay opciones.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetReplyOptions: tweetReplyOptionsSuccess })
        })
    },
}

module.exports = controller