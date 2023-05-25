'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const port = 3700
const server = '127.0.0.1'
const db = 'twitter-clone'
const mongodb = `mongodb://${server}:27017/${db}`

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.connect(mongodb)
    .then(() => {
        console.log('Conexion a mongodb establecida.')
        app.listen(port, () => {
            console.log(`Escuchando desde el puerto: ${port}`)
        })
    })
    .catch(err => {
        console.log(err)
    })