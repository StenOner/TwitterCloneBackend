'use strict'

const TweetTrend = require('../models/tweet_trend')

const controller = {
    TweetTrend: (req, res) => {
        const tweetTrendID = req.params.id
        TweetTrend.findById(tweetTrendID, (err, tweetTrendSuccess) => {
            if (!tweetTrendSuccess) return res.status(400).send({ message: 'No existe el trend.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrend: tweetTrendSuccess })
        })
            .populate([{ path: 'tweets', populate: [{ path: 'tweetID' }] }])
    },
    TweetTrending: (req, res) => {
        TweetTrend.find({}, (err, tweetTrendsSuccess) => {
            if (!tweetTrendsSuccess) return res.status(400).send({ message: 'No hay trends.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrends: tweetTrendsSuccess })
        })
            .populate([{ path: 'tweets', populate: [{ path: 'tweetID' }] }])
            .sort({ 'tweets': 1 })
            .limit(10)
    },
    deleteTweetTrend: (req, res) => {
        const tweetTrendID = req.params.id
        TweetTrend.findByIdAndDelete(tweetTrendID, (err, tweetTrendSuccess) => {
            if (!tweetTrendSuccess) return res.status(400).send({ message: 'No existe el trend.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrend: tweetTrendSuccess, message: 'Trend eliminado correctamente.' })
        })
    },
}

module.exports = controller