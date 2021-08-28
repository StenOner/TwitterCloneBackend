'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tweet_MediaContentSchema = Schema({
    "tweetID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet',
        required: true
    },
    "content": {
        type: String,
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_mediacontent', Tweet_MediaContentSchema)