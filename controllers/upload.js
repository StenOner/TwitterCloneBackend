'use strict'

const Profile = require('../models/profile')
const TweetCommentMediaContent = require('../models/tweet_comment_mediacontent')
const TweetMediaContent = require('../models/tweet_mediacontent')
const path = require('path')
const helper = require('../helpers/helper')
const fs = require('fs')

const controller = {
    uploadProfilePicture: (req, res) => {
        const body = req.body
        const file = req.file
        const profileID = body.profileID
        Profile.findByIdAndUpdate(profileID, { picture: file.filename }, { new: false }, (err, profileSuccess) => {
            if (!profileSuccess) return res.status(400).send({ message: 'No se encontro el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            console.log(`${helper.getFullTime()} - Se empezo a subir la foto de perfil ${file.filename}...`)
            return res.status(200).send({ message: 'La foto de perfil se subio exitosamente.' })
        })
    },
    uploadProfileBanner: (req, res) => {
        const body = req.body
        const file = req.file
        const profileID = body.profileID
        Profile.findByIdAndUpdate(profileID, { banner: file.filename }, { new: false }, (err, profileSuccess) => {
            if (!profileSuccess) return res.status(400).send({ message: 'No se encontro el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            console.log(`${helper.getFullTime()} - Se empezo a subir el banner de perfil ${file.filename}...`)
            return res.status(200).send({ message: 'El banner de perfil se subio exitosamente.' })
        })
    },
    uploadTweetImage: (req, res) => {
        const body = req.body
        const file = req.file
        const tweetMediaContentID = body.tweetMediaContentID
        TweetMediaContent.findByIdAndUpdate(tweetMediaContentID, { content: file.filename }, { new: false }, (err, tweetMediaContentSuccess) => {
            if (!tweetMediaContentSuccess) return res.status(400).send({ message: 'No se encontro el contenido de media para el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            console.log(`${helper.getFullTime()} - Se empezo a subir el banner de perfil ${file.filename}...`)
            return res.status(200).send({ message: 'El contenido de media se subio exitosamente.' })
        })
    },
    uploadTweetCommentImage: (req, res) => {
        const body = req.body
        const file = req.file
        const tweetCommentMediaContentID = body.tweetCommentMediaContentID
        TweetCommentMediaContent.findByIdAndUpdate(tweetCommentMediaContentID, { content: file.filename }, { new: false }, (err, tweetCommentMediaContentSuccess) => {
            if (!tweetCommentMediaContentSuccess) return res.status(400).send({ message: 'No se encontro el contenido de media para el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            console.log(`${helper.getFullTime()} - Se empezo a subir el banner de perfil ${file.filename}...`)
            return res.status(200).send({ message: 'El contenido de media se subio exitosamente.' })
        })
    },
    downloadFile: (req, res) => {
        const fileName = req.params.file
        const filePath = `./tmp/${fileName}`
        fs.stat(filePath, (err, stats) => {
            if (!stats) return res.status(400).send({ message: 'No existe el archivo.' })
            if (err) return res.status(500).send({ message: 'Se encontro un error al buscar el archivo.' })
            return res.sendFile(path.resolve(filePath))
        })
    },
}

module.exports = controller