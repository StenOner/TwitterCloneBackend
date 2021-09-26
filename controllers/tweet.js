'use strict'

const Tweet = require('../models/tweet')

const controller = {
    newTweet: (req, res) => {
        const tweet = new Tweet()
        const body = req.body
        tweet.profileID = body.profileID
        tweet.content = body.content
        tweet.createdAt = Date.now()
        tweet.state = body.state
        tweet.save((err, tweetSuccess) => {
            if (!tweetSuccess) return res.status(400).send({ message: 'No se pudo crear el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweet: tweetSuccess, message: 'Tweet creado correctamente.' })
        })
    },
    tweet: (req, res) => {
        const tweetID = req.params.id
        Tweet.findById(tweetID, (err, tweetSuccess) => {
            if (!tweetSuccess) return res.status(400).send({ message: 'No existe el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweet: tweetSuccess })
        }).populate({ path: 'profileID' })
    },
    tweets: (req, res) => {
        Tweet.find({}, (err, tweetsSuccess) => {
            if (!tweetsSuccess) return res.status(400).send({ message: 'No hay tweets.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweets: tweetsSuccess })
        }).populate({ path: 'profileID' })
    },
    tweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        Tweet.find({ profileID }, (err, tweetsSuccess) => {
            if (!tweetsSuccess) return res.status(400).send({ message: 'No hay tweets para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweets: tweetsSuccess })
        }).populate({ path: 'profileID' })
    },
    deleteTweet: (req, res) => {
        const tweetID = req.params.id
        Tweet.findByIdAndDelete(tweetID, (err, tweetSuccess) => {
            if (!tweetSuccess) return res.status(400).send({ message: 'No existe el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweet: tweetSuccess, message: 'Tweet eliminado correctamente.' })
        })
    },
    deleteTweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        Tweet.deleteMany({ profileID }, (err, tweetsSuccess) => {
            if (!tweetsSuccess) return res.status(400).send({ message: 'No existen tweets para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweets: tweetsSuccess, message: 'Tweets eliminados correctamente.' })
        })
    },
}

module.exports = controller