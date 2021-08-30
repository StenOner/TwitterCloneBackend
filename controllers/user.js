'use strict'

const User = require('../models/user')
const sha256 = require('crypto-js/sha256')

const controller = {
    newUser: (req, res) => {
        const user = new User()
        const body = req.body
        user.email = body.email
        user.password = sha256(body.password).toString()
        user.userName = body.userName
        user.createdAt = Date.now()
        user.state = body.state
        user.save((err, userSuccess) => {
            if (!userSuccess) return res.status(400).send({ message: 'No se pudo crear el usuario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ user: userSuccess, message: 'Usuario creado correctamente.' })
        })
    },
    user: (req, res) => {
        const userID = req.params.id
        User.findById(userID, (err, userSuccess) => {
            if (!userSuccess) return res.status(400).send({ message: 'No existe el usuario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ user: userSuccess })
        })
    },
    users: (req, res) => {
        User.find({}, (err, usersSuccess) => {
            if (!usersSuccess) return res.status(400).send({ message: 'No hay usuarios.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ users: usersSuccess })
        })
    },
    updateUser: (req, res) => {
        const userID = req.params.id
        const body = req.body
        const update = {
            userName: body.userName,
            state: body.state
        }
        User.findByIdAndUpdate(userID, update, (err, userSuccess) => {
            if (!userSuccess) return res.status(400).send({ message: 'No existe el usuario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ user: userSuccess, message: 'Usuario actualizado correctamente.' })
        })
    },
    updateUserEmail: (req, res) => {
        const body = req.body
        const userID = body._id
        const newEmail = body.newEmail
        User.findByIdAndUpdate(userID, { email: newEmail }, { select: '-_id email' }, (err, userSuccess) => {
            if (!userSuccess) return res.status(400).send({ message: 'No existe el usuario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ user: userSuccess, message: 'Correo actualizado correctamente.' })
        })
    },
    updateUserPassword: (req, res) => {
        const body = req.body
        const email = body.email
        const oldPassword = sha256(body.oldPassword).toString()
        const newPassword = sha256(body.newPassword).toString()
        User.findOneAndUpdate({ email: email, password: oldPassword }, { password: newPassword }, { select: '-_id email' }, (err, userSuccess) => {
            if (!userSuccess) return res.status(400).send({ message: 'La contraseña o el correo es incorrecto.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ user: userSuccess, message: 'Contraseña actualizada correctamente.' })
        })
    },
    deleteUser: (req, res) => {
        const body = req.body
        const email = body.email
        const password = sha256(body.password).toString()
        User.findOneAndDelete({ email: email, password: password }, (err, userSuccess) => {
            if (!userSuccess) return res.status(400).send({ message: 'No existe el usuario.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ user: userSuccess, message: 'Usuario eliminado correctamente.' })
        })
    }
}

module.exports = controller