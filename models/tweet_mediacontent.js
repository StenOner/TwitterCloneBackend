'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetMediaContentSchema = Schema({
    "tweetID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet',
        required: true
    },
    "content": String,
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_mediacontent', TweetMediaContentSchema)