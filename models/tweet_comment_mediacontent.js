'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tweet_Comment_MediaContentSchema = Schema({
    "tweetCommentID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet_comment',
        required: true
    },
    "content": String,
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_comment_mediacontent', Tweet_Comment_MediaContentSchema)