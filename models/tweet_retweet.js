'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tweet_ReTweetSchema = Schema({
    "tweetID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet',
        required: true
    },
    "userID": {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_retweet', Tweet_ReTweetSchema)