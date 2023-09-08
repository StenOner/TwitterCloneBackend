'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetMentionSchema = new Schema({
    "tweetID": {
        type: Schema.Types.ObjectId,
        ref: 'tweet',
        required: true
    },
    "profiles": [{
        "profileID": {
            type: Schema.Types.ObjectId,
            ref: 'profile',
            required: true
        },
    }],
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('tweet_mention', TweetMentionSchema)