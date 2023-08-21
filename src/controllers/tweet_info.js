'use strict'

const Tweet = require('../models/tweet')
const ProfileFollow = require('../models/profile_follow')
const { getTweetInfo } = require('../utils/tweet-info')

const controller = {
    tweetGeneralInformation: async (req, res) => {
        const tweetID = req.params.id
        const tweet = await Tweet.findById(tweetID)
            .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
            .exec()
        const tweetInfo = await getTweetInfo(tweet)
        return res.status(200).send({ tweetInfo })
    },
    followingTweetsGeneralInformationByProfileID: async (req, res) => {
        const profileID = req.params.id
        const profileFollowing = await ProfileFollow.find({ followerProfileID: profileID })
        const followersProfileID = profileFollowing.map((profileFollow) => profileFollow.followingProfileID)
        const tweets = await Tweet.find({ profileID: { '$in': [...followersProfileID, profileID] } })
            .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
            .sort({ createdAt: 'desc' })
            .exec()
        const tweetsInfo = await Promise.all(
            tweets.map(async (tweet) => {
                return await getTweetInfo(tweet)
            })
        )
        return res.status(200).send({ tweetsInfo })
    },
}

module.exports = controller