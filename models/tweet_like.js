'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tweet_LikeSchema = Schema({
    "tweetID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet',
        required: true
    },
    "profileID": {
        type: Schema.Types.ObjectId,
        ref: 'profile',
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_like', Tweet_LikeSchema)