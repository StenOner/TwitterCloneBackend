'use strict'

const ProfileFollow = require('../models/profile_follow')

const controller = {
    newProfileFollow: (req, res) => {
        const profileFollow = new ProfileFollow()
        const body = req.body
        profileFollow.followingProfileID = body.followingProfileID
        profileFollow.followerProfileID = body.followerProfileID
        profileFollow.createdAt = Date.now()
        profileFollow.state = body.state
        profileFollow.save((err, profileFollowSuccess) => {
            if (!profileFollowSuccess) return res.status(400).send({ message: 'No se pudo seguir el perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            profileFollow.populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }], (err, profileFollow) => {
                return res.status(200).send({ profileFollow: profileFollow, message: 'Se empezo a seguir el perfil correctamente.' })
            })
        })
    },
    profileFollow: (req, res) => {
        const profileFollowID = req.params.id
        ProfileFollow.findById(profileFollowID, (err, profileFollowSuccess) => {
            if (!profileFollowSuccess) return res.status(400).send({ message: 'No estas siguiendo a este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profileFollow: profileFollowSuccess })
        })
            .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
    },
    profileFollowers: (req, res) => {
        const followingProfileID = req.params.followingid
        ProfileFollow.find({ followingProfileID }, (err, profileFollowersSuccess) => {
            if (!profileFollowersSuccess) return res.status(400).send({ message: 'No existen seguidores para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profileFollowers: profileFollowersSuccess })
        })
            .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
    },
    profileFollowing: (req, res) => {
        const followerProfileID = req.params.followerid
        ProfileFollow.find({ followerProfileID }, (err, profilesFollowingSuccess) => {
            if (!profilesFollowingSuccess) return res.status(400).send({ message: 'No existen perfiles a los que estes siguiendo.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profileFollowing: profilesFollowingSuccess })
        })
            .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
    },
    deleteProfileFollow: (req, res) => {
        const profileFollowID = req.params.id
        ProfileFollow.findByIdAndDelete(profileFollowID, (err, profileFollowSuccess) => {
            if (!profileFollowSuccess) return res.status(400).send({ message: 'No estas siguiendo a este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ profileFollow: profileFollowSuccess, message: 'Se dejo de seguir el perfil correctamente.' })
        })
    },
}

module.exports = controller