'use strict'

const Profile = require('../models/profile')

const controller = {
    newProfile: (req, res) => {
        const profile = new Profile()
        const body = req.body
        profile.userID = body.userID
        profile.fullName = body.fullName
        profile.picture = null
        profile.banner = null
        profile.bio = body.bio
        profile.birthDate = body.birthDate
        profile.createdAt = Date.now()
        profile.state = body.state
        profile.save((err, profileSuccess) => {
            if (!profileSuccess) return res.status(400).send({ message: 'No se pudo crear el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profile: profileSuccess, message: 'Perfil creado correctamente.' })
        })
    },
    profile: (req, res) => {
        const profileID = req.params.id
        Profile.findById(profileID, (err, profileSuccess) => {
            if (!profileSuccess) return res.status(400).send({ message: 'No existe el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profile: profileSuccess })
        }).populate({ path: 'userID' })
    },
    profiles: (req, res) => {
        Profile.find({}, (err, profilesSuccess) => {
            if (!profilesSuccess) return res.status(400).send({ message: 'No hay perfiles.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profiles: profilesSuccess })
        }).populate({ path: 'userID' })
    },
    updateProfile: (req, res) => {
        const profileID = req.params.id
        const body = req.body
        const update = {
            fullName: body.fullName,
            bio: body.bio,
            birthDate: body.birthDate,
            state: body.state
        }
        Profile.findByIdAndUpdate(profileID, update, (err, profileSuccess) => {
            if (!profileSuccess) return res.status(400).send({ message: 'No existe el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profile: profileSuccess, message: 'Perfil actualizado correctamente.' })
        }).populate({ path: 'userID' })
    },
    deleteProfile: (req, res) => {
        const profileID = req.params.id
        Profile.findByIdAndDelete(profileID, (err, profileSuccess) => {
            if (!profileSuccess) return res.status(400).send({ message: 'No existe el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profile: profileSuccess, message: 'Perfil eliminado correctamente.' })
        })
    }
}

module.exports = controller