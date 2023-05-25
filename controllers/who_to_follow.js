'use strict'

const Profile = require('../models/profile')
const ProfileFollow = require('../models/profile_follow')

const controller = {
    whoToFollow: (req, res) => {
        const profileID = req.params.id
        ProfileFollow.find({ followerProfileID: profileID }, (err, profilesFollowingSuccess) => {
            if (!profilesFollowingSuccess) return res.status(400).send({ message: 'No existen perfiles a los que estes siguiendo.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })

            Profile.find({
                $and: [
                    { _id: { $ne: profileID } },
                ]
            }, (err, profilesSuccess) => {
                if (!profilesSuccess) return res.status(400).send({ message: 'No hay perfiles.' })
                if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })

                return res.status(200).send({
                    profiles: profilesSuccess.reduce((acc, currentProfile) => {
                        if (profilesFollowingSuccess.some((profileFollowing) => profileFollowing.followingProfileID.toString() === currentProfile._id.toString())) return acc
                        return [...acc, currentProfile]
                    }, [])
                })
            })
                .limit(50)
        })
    },
}

module.exports = controller