'use strict'

const TweetRetweet = require('../models/tweet_retweet')

const controller = {
    newTweetRetweet: (req, res) => {
        const tweetRetweet = new TweetRetweet()
        const body = req.body
        tweetRetweet.tweetID = body.tweetID
        tweetRetweet.profileID = body.profileID
        tweetRetweet.createdAt = Date.now()
        tweetRetweet.state = body.state
        tweetRetweet.save((err, tweetRetweetSuccess) => {
            if (!tweetRetweetSuccess) return res.status(400).send({ message: 'No se pudo crear el retweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweet: tweetRetweetSuccess, message: 'Retweet creado correctamente.' })
        })
    },
    tweetRetweet: (req, res) => {
        const tweetRetweetID = req.params.id
        TweetRetweet.findById(tweetRetweetID, (err, tweetRetweetSuccess) => {
            if (!tweetRetweetSuccess) return res.status(400).send({ message: 'No existe el retweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweet: tweetRetweetSuccess })
        }).populate({ path: 'tweetID' }).populate({ path: 'profileID' })
    },
    tweetRetweetsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetRetweet.find({ tweetID }, (err, tweetRetweetsSuccess) => {
            if (!tweetRetweetsSuccess) return res.status(400).send({ message: 'No hay retweets para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweets: tweetRetweetsSuccess })
        }).populate({ path: 'tweetID' }).populate({ path: 'profileID' }).sort({ createdAt: 'desc' })
    },
    tweetRetweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetRetweet.find({ profileID }, (err, tweetRetweetsSuccess) => {
            if (!tweetRetweetsSuccess) return res.status(400).send({ message: 'No hay retweets para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweets: tweetRetweetsSuccess })
        }).populate({ path: 'tweetID' }).populate({ path: 'profileID' }).sort({ createdAt: 'desc' })
    },
    deleteTweetRetweet: (req, res) => {
        const tweetRetweetID = req.params.id
        TweetRetweet.findByIdAndDelete(tweetRetweetID, (err, tweetRetweetSuccess) => {
            if (!tweetRetweetSuccess) return res.status(400).send({ message: 'No existe el retweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweet: tweetRetweetSuccess, message: 'Retweet eliminado correctamente.' })
        })
    },
    deleteTweetRetweetsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetRetweet.deleteMany({ tweetID }, (err, tweetRetweetsSuccess) => {
            if (!tweetRetweetsSuccess) return res.status(400).send({ message: 'No existen retweets para este tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweets: tweetRetweetsSuccess, message: 'Retweets eliminados correctamente.' })
        })
    },
    deleteTweetRetweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        TweetRetweet.deleteMany({ profileID }, (err, tweetRetweetsSuccess) => {
            if (!tweetRetweetsSuccess) return res.status(400).send({ message: 'No existen retweets para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetRetweets: tweetRetweetsSuccess, message: 'Retweets eliminados correctamente.' })
        })
    },
}

module.exports = controller