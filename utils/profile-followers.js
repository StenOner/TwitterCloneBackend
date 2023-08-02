'use strict'

const ProfileFollow = require('../models/profile_follow')

exports.getProfileFollowers = async (profile) => {
    const profileFollowers = await ProfileFollow.find({ followingProfileID: profile._id })
        .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
        .exec()

    return {
        ...profile._doc,
        followers: profileFollowers,
    }
}