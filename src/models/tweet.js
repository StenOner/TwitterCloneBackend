'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetSchema = new Schema({
    "profileID": {
        type: Schema.Types.ObjectId,
        ref: 'profile',
        required: true
    },
    "tweetReplyOptionID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet_reply_option',
        required: true
    },
    "content": {
        type: String,
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet', TweetSchema)