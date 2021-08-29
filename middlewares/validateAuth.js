'use strict'

const authValidation = {
    authValidate: (req, res, next) => {
        const body = req.body
        if (!body.email || !(body.email.trim().length > 0)) return res.status(403).send({ message: 'El email no puede estar vacio.' })
        if (!body.password || !(body.password.trim().length > 0)) return res.status(403).send({ message: 'La clave no puede estar vacia.' })
        next()
    },
    refreshValidate: (req, res, next) => {
        const body = req.body
        if (!body.accessToken) return res.status(403).send({ message: 'No se recivio ningun token de acceso.' })
        if (!body.refreshToken) return res.status(403).send({ message: 'No se recivio ningun token de recarga.' })
        next()
    }
}


module.exports = authValidation