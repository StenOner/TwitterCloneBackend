'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RefreshTokenSchema = new Schema({
    "token": String,
    "createdAt": Date,
    "state": Boolean
})

module.exports = mongoose.model('refresh_token', RefreshTokenSchema)