'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetSchema = Schema({
    "userID": {
        type: Schema.Types.ObjectId,
        ref: 'user',
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