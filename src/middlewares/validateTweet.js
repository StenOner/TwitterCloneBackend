'use strict'

const tweetValidation = {
    fullValidate: (req, res, next) => {
        const body = req.body
        if (!body.profileID || !(body.profileID.trim().length > 0)) return res.status(422).send({ message: 'El id del perfil no puede estar vacio.' })
        if (!body.tweetReplyOptionID || !(body.tweetReplyOptionID.trim().length > 0)) return res.status(422).send({ message: 'La opcion para responder no puede estar vacia.' })
        if (!body.content || !(body.content.trim().length > 0)) return res.status(422).send({ message: 'El contenido no puede estar vacio.' })
        if (!(typeof body.state === 'boolean')) return res.status(422).send({ message: 'El estado del tweet es necesario.' })
        next()
    },
}

module.exports = tweetValidation