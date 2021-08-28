'use strict'

const express = require('express')
const app = express()
const routes = require('./routes/twitter_routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

app.use('/', routes)

module.exports = app