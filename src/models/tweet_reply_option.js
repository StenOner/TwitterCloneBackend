'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetReplyOptionsSchema = Schema({
    "content": {
        type: String,
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_reply_option', TweetReplyOptionsSchema)