'use strict'

const ProfileFollow = require('../models/profile_follow')
const { getProfileFollowers } = require('../utils/profile-followers')

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
    profileFollowers: async (req, res) => {
        const followingProfileID = req.params.followingid
        const profileFollowers = await ProfileFollow.find({ followingProfileID })
            .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
            .exec()
        const followers = await Promise.all(
            profileFollowers.map(async (profileFollow) => {
                return {
                    ...profileFollow._doc,
                    followingProfileID: await getProfileFollowers(profileFollow.followingProfileID),
                    followerProfileID: await getProfileFollowers(profileFollow.followerProfileID),
                }
            })
        )
        return res.status(200).send({ profileFollowers: followers })
    },
    profileFollowing: async (req, res) => {
        const followerProfileID = req.params.followerid
        const profileFollowing = await ProfileFollow.find({ followerProfileID })
            .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
        const following = await Promise.all(
            profileFollowing.map(async (profileFollow) => {
                return {
                    ...profileFollow._doc,
                    followingProfileID: await getProfileFollowers(profileFollow.followingProfileID),
                    followerProfileID: await getProfileFollowers(profileFollow.followerProfileID),
                }
            })
        )
        return res.status(200).send({ profileFollowing: following })
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