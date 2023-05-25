'use strict'

const TweetMention = require('../models/tweet_mention')

const controller = {
    newTweetMention: (req, res) => {
        const tweetMention = new TweetMention()
        const body = req.body
        tweetMention.tweetID = body.tweetID
        tweetMention.profiles = body.profiles
        tweetMention.createdAt = Date.now()
        tweetMention.state = body.state
        tweetMention.save((err, tweetMentionSuccess) => {
            if (!tweetMentionSuccess) return res.status(400).send({ message: 'No se pudo crear la mencion.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMention: tweetMentionSuccess, message: 'Mencion creada correctamente.' })
        })
    },
    TweetMention: (req, res) => {
        const tweetMentionID = req.params.id
        TweetMention.findById(tweetMentionID, (err, tweetMentionSuccess) => {
            if (!tweetMentionSuccess) return res.status(400).send({ message: 'No existe la mencion.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMention: tweetMentionSuccess })
        })
    },
    TweetMentions: (req, res) => {
        TweetMention.find({}, (err, tweetMentionsSuccess) => {
            if (!tweetMentionsSuccess) return res.status(400).send({ message: 'No hay menciones.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMentions: tweetMentionsSuccess })
        })
    },
    TweetMentionsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetMention.find({ tweetID }, (err, tweetMentionsSuccess) => {
            if (!tweetMentionsSuccess) return res.status(400).send({ message: 'No hay menciones.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMentions: tweetMentionsSuccess })
        })
    },
    deleteTweetMention: (req, res) => {
        const tweetMentionID = req.params.id
        TweetMention.findByIdAndDelete(tweetMentionID, (err, tweetMentionSuccess) => {
            if (!tweetMentionSuccess) return res.status(400).send({ message: 'No existe la mencion.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMention: tweetMentionSuccess, message: 'Mencion eliminada correctamente.' })
        })
    },
    deleteTweetMentionsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetMention.deleteMany({ tweetID }, (err, tweetMentionsSuccess) => {
            if (!tweetMentionsSuccess) return res.status(400).send({ message: 'No existen las menciones.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetMentions: tweetMentionsSuccess, message: 'Menciones eliminadas correctamente.' })
        })
    },
}

module.exports = controller