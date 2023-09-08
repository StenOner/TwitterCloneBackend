'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    "email": {
        type: String,
        required: true,
        unique: true
    },
    "password": {
        type: String,
        required: true,
        select: false
    },
    "userName": {
        type: String,
        required: true
    },
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('user', UserSchema)