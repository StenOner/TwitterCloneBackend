'use strict'

const TweetTrend = require('../models/tweet_trend')

const controller = {
    newTweetTrend: (req, res) => {
        const tweetTrend = new TweetTrend()
        const body = req.body
        tweetTrend.tweetID = body.tweetID
        tweetTrend.trends = body.trends
        tweetTrend.createdAt = Date.now()
        tweetTrend.state = body.state
        tweetTrend.save((err, tweetTrendSuccess) => {
            if (!tweetTrendSuccess) return res.status(400).send({ message: 'No se pudo crear el trend.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            tweetTrend.populate({ path: 'tweetID' }, (err, tweetTrend) => {
                return res.status(200).send({ tweetTrend: tweetTrend, message: 'Trend creado correctamente.' })
            })
        })
    },
    TweetTrend: (req, res) => {
        const tweetTrendID = req.params.id
        TweetTrend.findById(tweetTrendID, (err, tweetTrendSuccess) => {
            if (!tweetTrendSuccess) return res.status(400).send({ message: 'No existe el trend.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrend: tweetTrendSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    TweetTrends: (req, res) => {
        TweetTrend.find({}, (err, tweetTrendsSuccess) => {
            if (!tweetTrendsSuccess) return res.status(400).send({ message: 'No hay trends.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrends: tweetTrendsSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    TweetTrendsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetTrend.find({ tweetID }, (err, tweetTrendsSuccess) => {
            if (!tweetTrendsSuccess) return res.status(400).send({ message: 'No hay trends.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrends: tweetTrendsSuccess })
        })
            .populate({ path: 'tweetID' })
    },
    deleteTweetTrend: (req, res) => {
        const tweetTrendID = req.params.id
        TweetTrend.findByIdAndDelete(tweetTrendID, (err, tweetTrendSuccess) => {
            if (!tweetTrendSuccess) return res.status(400).send({ message: 'No existe el trend.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrend: tweetTrendSuccess, message: 'Trend eliminado correctamente.' })
        })
    },
    deleteTweetTrendsByTweetID: (req, res) => {
        const tweetID = req.params.id
        TweetTrend.deleteMany({ tweetID }, (err, tweetTrendsSuccess) => {
            if (!tweetTrendsSuccess) return res.status(400).send({ message: 'No existen los trends.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweetTrends: tweetTrendsSuccess, message: 'Trends eliminados correctamente.' })
        })
    },
}

module.exports = controller