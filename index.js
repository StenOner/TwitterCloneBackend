'use strict'

require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT
const user = process.env.MONGO_USER
const password = process.env.MONGO_PASSWORD
const server = process.env.MONGO_SERVER
const database = process.env.MONGO_DATABASE
const mongo_connectionstring = `mongodb+srv://${user}:${password}@${server}/${database}`

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.connect(mongo_connectionstring)
    .then(() => {
        console.log('Conexion a mongodb establecida.')
        app.listen(port, () => {
            console.log(`Escuchando desde el puerto: ${port}`)
        })
    })
    .catch(err => {
        console.log(err)
    })