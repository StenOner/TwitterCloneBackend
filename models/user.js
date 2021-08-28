'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
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
    "userName": String,
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('user', UserSchema)