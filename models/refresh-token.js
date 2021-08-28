'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RefreshTokenSchema = Schema({
    "token": String,
    "createdAt": Date
})

module.exports = mongoose.model('refreshtoken', RefreshTokenSchema)