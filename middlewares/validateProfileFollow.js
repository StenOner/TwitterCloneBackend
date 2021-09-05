'use strict'

const profileFollowValidation = {
    fullValidate: (req, res, next) => {
        const body = req.body
        if (!body.followingProfileID || !(body.followingProfileID.trim().length > 0)) return res.status(422).send({ message: 'El id del perfil a seguir no puede estar vacio.' })
        if (!body.followerProfileID || !(body.followerProfileID.trim().length > 0)) return res.status(422).send({ message: 'El id del perfil del seguidor no puede estar vacio.' })
        if (!(typeof body.state === 'boolean')) return res.status(422).send({ message: 'El estado es necesario.' })
        next()
    },
    sameProfileValidate: (req, res, next) => {
        const body = req.body
        if (body.followingProfileID === body.followerProfileID) return res.status(422).send({ message: 'No se puede seguir al mismo perfil.' })
        next()
    },
}

module.exports = profileFollowValidation