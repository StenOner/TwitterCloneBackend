'use strict'

const TweetTrend = require('../models/tweet_trend')

const listTrendsFromContent = (content) => {
    return content.split(' ').filter((word) => /^#(\w|\d)+$/g.test(word))
}

const newTweetTrend = ({ trend, tweetID }) => {
    console.log('newTweetTrend', trend, tweetID);
    const tweetTrend = new TweetTrend()
    tweetTrend.trend = trend
    tweetTrend.tweets = [{ tweetID }]
    tweetTrend.createdAt = Date.now()
    tweetTrend.state = true
    tweetTrend.save((err, tweetTrendSuccess) => {
        if (!tweetTrendSuccess) return { message: 'No se pudo crear el trend.' }
        if (err) return { message: 'No se pudo resolver la peticion.' }
        tweetTrend.populate([{ path: 'tweets' }], (err, tweetTrend) => {
            return { tweetTrend: tweetTrend, message: 'Trend creado correctamente.' }
        })
    })
}

const updateTweetTrend = ({ trend, tweetID }) => {
    TweetTrend.updateOne({ trend, 'tweets.tweetID': { $ne: tweetID } }, { $push: { tweets: { tweetID } } }, { runValidators: true }, (err, tweetTrendSuccess) => {
        console.log('updateTweetTrend', trend, tweetID);
        if (!tweetTrendSuccess) return { message: 'No se pudo actualizar el trend.' }
        if (err) return { message: 'No se pudo resolver la peticion.' }
        return { tweetTrend: tweetTrendSuccess }
    })
        .populate([{ path: 'tweets' }])
}

exports.handleTrends = async function (content, tweetID) {
    const newTrends = listTrendsFromContent(content)
    console.log(newTrends);
    const trends = await TweetTrend.find({})
        .exec()
    newTrends.forEach((newTrend) => {
        const newTrendBody = {
            trend: newTrend,
            tweetID,
        }
        if (trends.some(({ trend }) => trend === newTrend)) return updateTweetTrend(newTrendBody)
        return newTweetTrend(newTrendBody)
    })
}