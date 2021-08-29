'use strict'

const userValidation = {
    fullValidate: function (req, res, next) {
        const body = req.body
        if (!body.email || !(body.email.trim().length > 0)) return res.status(403).send({ message: 'El email no puede estar vacio.' })
        if (!body.email.includes('@')) return res.status(403).send({ message: 'El email ingresado no es valido.' })
        if (!body.password || !(body.password.trim().length > 0)) return res.status(403).send({ message: 'La clave no puede estar vacia.' })
        if (!body.userName || !(body.userName.trim().length > 0)) return res.status(403).send({ message: 'El nombre de usuario es necesario.' })
        next()
    },
    noPasswordValidate: function (req, res, next) {
        const body = req.body
        if (!body.email || !(body.email.trim().length > 0)) return res.status(403).send({ message: 'El correo no puede estar vacio.' })
        if (!body.email.includes('@')) return res.status(403).send({ message: 'El correo ingresado no es valido.' })
        if (!body.userName || !(body.userName.trim().length > 0)) return res.status(403).send({ message: 'El nombre de usuario es necesario.' })
        next()
    },
    updateEmailValidate: function (req, res, next) {
        const body = req.body
        if (!body.newEmail || !(body.newEmail.trim().length > 0)) return res.status(403).send({ message: 'El nuevo correo no puede estar vacio.' })
        if (!body.newEmail.includes('@')) return res.status(403).send({ message: 'El nuevo correo ingresado no es valido.' })
        next()
    },
    updatePasswordValidate: function (req, res, next) {
        const body = req.body
        if (!body.email || !(body.email.trim().length > 0)) return res.status(403).send({ message: 'El correo no es valido.' })
        if (!body.oldPassword || !(body.oldPassword.trim().length > 0)) return res.status(403).send({ message: 'La clave antigua no es valida.' })
        if (!body.newPassword || !(body.newPassword.trim().length > 0)) return res.status(403).send({ message: 'La nueva clave es necesaria.' })
        if (!body.newPassword2 || !(body.newPassword2.trim().length > 0)) return res.status(403).send({ message: 'La nueva clave2 es necesaria.' })
        if (body.newPassword !== body.newPassword2) return res.status(403).send({ message: 'La nueva clave no coincide.' })
        if (body.oldPassword === body.newPassword) return res.status(403).send({ message: 'La nueva clave no puede ser igual a la anterior.' })
        next()
    }
}

module.exports = userValidation