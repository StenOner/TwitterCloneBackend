'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileFollowSchema = Schema({
    "followingProfileID": {
        type: Schema.Types.ObjectId,
        ref: 'profile',
        required: true
    },
    "followerProfileID": {
        type: Schema.Types.ObjectId,
        ref: 'profile',
        required: true
    },
    "createdAt": Date,
    "state": Boolean,
})

module.exports = mongoose.model('profile_follow', ProfileFollowSchema)