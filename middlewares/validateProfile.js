'use strict'

const profileValidation = {
    fullValidate: (req, res, next) => {
        const body = req.body
        if (!body.userID || !(body.userID.trim().length > 0)) return res.status(403).send({ message: 'El id del usuario no puede estar vacio.' })
        if (!body.fullName || !(body.fullName.trim().length > 0)) return res.status(403).send({ message: 'El nombre no puede estar vacio.' })
        if (!body.bio || !(body.bio.trim().length > 0)) return res.status(403).send({ message: 'La descripcion no puede estar vacia.' })
        if (!body.birthDate) return res.status(403).send({ message: 'La fecha de nacimiento no puede estar vacia.' })
        if (!(typeof body.state === 'boolean')) return res.status(403).send({ message: 'El estado del perfil es necesario.' })
        next()
    },
}

module.exports = profileValidation