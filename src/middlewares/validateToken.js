'use strict'

const jwt = require('jsonwebtoken')
require('dotenv').config()

function authenticateToken(req, res, next) {
    try {
        const [bearer, token] = req.headers['authorization'].split(' ')
        if (token == null || bearer != 'Bearer') return res.sendStatus(401)
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    } catch (error) {
        return res.sendStatus(401)
    }
}

module.exports = authenticateToken