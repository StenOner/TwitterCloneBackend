'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetCommentLikeSchema = Schema({
    "tweetCommentID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet_comment',
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

module.exports = mongoose.model('tweet_comment_like', TweetCommentLikeSchema)