'use strict'

const fileValidation = {
    fileValidate: (req, res, next) => {
        const file = req.file
        if (!file) return res.status(422).send({ message: 'El archivo no existe en el servidor.' })
        next()
    },
    profileValidate: (req, res, next) => {
        const body = req.body
        if (!body.profileID || !(body.profileID.trim().length > 0)) return res.status(422).send({ message: 'El id del perfil no puede estar vacio.' })
        next()
    },
    tweetMediaContentValidate: (req, res, next) => {
        const body = req.body
        if (!body.tweetMediaContentID || !(body.tweetMediaContentID.trim().length > 0)) return res.status(422).send({ message: 'El id para el contenido de media del tweet no puede estar vacio.' })
        next()
    },
    tweetCommentMediaContentValidate: (req, res, next) => {
        const body = req.body
        if (!body.tweetCommentMediaContentID || !(body.tweetCommentMediaContentID.trim().length > 0)) return res.status(422).send({ message: 'El id para el contenido de media del comentario no puede estar vacio.' })
        next()
    },
}

module.exports = fileValidation