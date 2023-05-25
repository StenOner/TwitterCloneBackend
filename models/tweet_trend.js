'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetTrendSchema = Schema({
    "tweetID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet',
        required: true
    },
    "trends": [{
        "trend": {
            type: String,
            required: true
        }
    }],
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_trend', TweetTrendSchema)