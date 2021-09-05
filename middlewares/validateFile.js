'use strict'

const fileValidation = {
    fileValidate: (req, res, next) => {
        const file = req.file
        const body = req.body
        if (!body.profileID || !(body.profileID.trim().length > 0)) return res.status(422).send({ message: 'El id del perfil no puede estar vacio.' })
        if (!file) return res.status(422).send({ message: 'El archivo no existe en el servidor.' })
        next()
    },
}

module.exports = fileValidation