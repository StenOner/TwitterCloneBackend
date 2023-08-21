'use strict'

const TweetTrend = require('../models/tweet_trend')

const listTrendsFromContent = (content) => {
    return content.split(' ').filter((word) => /^#(\w|\d)+$/g.test(word))
}

const generateBulkWrite = (tweetID, newTrends, currentTrends) => {
    return Array.from(new Set(newTrends)).map((newTrend) => {
        if (currentTrends.some(({ trend }) => trend === newTrend)) {
            return {
                updateOne: {
                    filter: { trend: newTrend, 'tweets.tweetID': { $ne: tweetID } },
                    update: { $push: { tweets: { tweetID } } },
                },
            }
        }
        return {
            insertOne: {
                document: {
                    trend: newTrend,
                    tweets: [{ tweetID }],
                    createdAt: Date.now(),
                    state: true,
                },
            },
        }
    })
}

exports.handleTrends = async function (content, tweetID) {
    const newTrends = listTrendsFromContent(content)
    if (!newTrends || newTrends.length < 1) return console.log('No existen trends a insertar.')
    const trends = await TweetTrend.find({})
        .exec()
    const bulkWrites = generateBulkWrite(tweetID, newTrends, trends)
    TweetTrend.bulkWrite(bulkWrites).then((res) => {
        console.log(res)
    })
}