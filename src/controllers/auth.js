'use strict'

const User = require('../models/user')
const RefreshToken = require('../models/refresh_token')
const sha256 = require('crypto-js/sha256')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const controller = {
    auth: (req, res) => {
        const body = req.body
        const email = body.email
        const password = sha256(body.password).toString()
        User.findOne({ email: email, password: password }, '', { select: '_id userName state' }, (err, userSuccess) => {
            if (!userSuccess || userSuccess == '') return res.status(401).send({ message: 'Login no autorizado.' })
            if (!userSuccess.state) return res.status(401).send({ message: 'Usuario desactivado.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            const jwtAccessToken = jwt.sign({ _id: userSuccess._id, userName: userSuccess.userName, state: userSuccess.state }, process.env.ACCESS_TOKEN, { expiresIn: process.env.EXPIRES_IN })
            const jwtRefreshToken = jwt.sign({ _id: userSuccess._id }, process.env.REFRESH_TOKEN)
            const refreshToken = new RefreshToken()
            refreshToken.token = jwtRefreshToken
            refreshToken.save((err, refreshTokenSuccess) => {
                if (!refreshTokenSuccess) return res.status(400).send({ message: 'No se pudo generar el token para refrescar.' })
                if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
                return res.status(200).send({ accessToken: jwtAccessToken, refreshToken: jwtRefreshToken })
            })
        })
    },
    refreshToken: (req, res) => {
        const body = req.body
        const accessToken = body.accessToken
        const refreshToken = body.refreshToken
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err) => {
            if (err.message != 'jwt expired') return res.sendStatus(401)
            RefreshToken.findOne({ token: refreshToken }, (err, refreshTokenSuccess) => {
                if (!refreshTokenSuccess || refreshTokenSuccess == '') return res.status(401).send({ message: 'No existe el token.' })
                if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
                const accessPayload = jwt.decode(accessToken)
                const refreshPayload = jwt.decode(refreshToken)
                if (accessPayload._id !== refreshPayload._id) return res.sendStatus(401)
                User.findById(refreshPayload._id, '', { select: '_id userName state' }, (err, userSuccess) => {
                    if (!userSuccess || userSuccess == '') return res.status(401).send({ message: 'Login no autorizado.' })
                    if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
                    if (!userSuccess.state) return res.status(401).send({ message: 'Usuario desactivado.' })
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
                        if (err) return res.sendStatus(401)
                        const jwtAccessToken = jwt.sign({ _id: userSuccess._id, userName: userSuccess.userName, state: userSuccess.state }, process.env.ACCESS_TOKEN, { expiresIn: process.env.EXPIRES_IN })
                        return res.status(200).send({ accessToken: jwtAccessToken })
                    })
                })
            })
        })
    },
    logout: (req, res) => {
        const token = req.body.token
        RefreshToken.findOneAndDelete({ token: token }, (err, refreshTokenSuccess) => {
            if (!refreshTokenSuccess || refreshTokenSuccess == '') return res.status(401).send({ message: 'No existe la sesion.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ message: 'Deslogeado exitosamente.' })
        })
    },
}

module.exports = controller