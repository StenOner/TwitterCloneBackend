'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = Schema({
    "userID": {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    "fullName": {
        type: String,
        required: true
    },
    "picture": String,
    "bio": {
        type: String,
        required: true
    },
    "birthDate": {
        type: Date,
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('profile', ProfileSchema)