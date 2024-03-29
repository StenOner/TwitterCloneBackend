'use strict'

const Tweet = require('../models/tweet')
const ProfileFollow = require('../models/profile_follow')
const { handleTrends } = require('../utils/trend')
const { getTweetInfo } = require('../utils/tweet-info')

const controller = {
    newTweet: (req, res) => {
        const tweet = new Tweet()
        const body = req.body
        tweet.profileID = body.profileID
        tweet.tweetReplyOptionID = body.tweetReplyOptionID
        tweet.content = body.content
        tweet.createdAt = Date.now()
        tweet.state = body.state
        tweet.save(async (err, tweetSuccess) => {
            if (!tweetSuccess) return res.status(400).send({ message: 'No se pudo crear el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            const newTweet = await tweetSuccess.populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
                .execPopulate()
            const tweetInfo = await getTweetInfo(newTweet)
            handleTrends(newTweet.content, newTweet._id)
            return res.status(200).send({ tweet: tweetInfo, message: 'Tweet creado correctamente.' })
        })
    },
    tweet: (req, res) => {
        const tweetID = req.params.id
        Tweet.findById(tweetID, (err, tweetSuccess) => {
            if (!tweetSuccess) return res.status(400).send({ message: 'No existe el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweet: tweetSuccess })
        })
            .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
    },
    tweets: async (req, res) => {
        const tweets = await Tweet.find({})
            .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
            .sort({ createdAt: 'desc' })
            .limit(100)
            .exec()
        const tweetsInfo = await Promise.all(
            tweets.map(async (tweet) => {
                return await getTweetInfo(tweet)
            })
        )
        return res.status(200).send({ tweetsInfo })
    },
    tweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        Tweet.find({ profileID }, (err, tweetsSuccess) => {
            if (!tweetsSuccess) return res.status(400).send({ message: 'No hay tweets para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweets: tweetsSuccess })
        })
            .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
            .sort({ createdAt: 'desc' })
    },
    followingTweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        ProfileFollow.find({ followerProfileID: profileID }, (err, profileFollowSuccess) => {
            if (!profileFollowSuccess) return res.status(400).send({ message: 'Este perfil no esta siguiendo a ningun otro.' })
            const followersProfileID = profileFollowSuccess.map((profileFollow) => profileFollow.followingProfileID)
            Tweet.find({ profileID: { '$in': [...followersProfileID, profileID] } }, (err, tweetsSuccess) => {
                if (!tweetsSuccess) return res.status(400).send({ message: 'No hay tweets.' })
                return res.status(200).send({ tweets: tweetsSuccess })
            })
                .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
                .sort({ createdAt: 'desc' })
        })
    },
    deleteTweet: (req, res) => {
        const tweetID = req.params.id
        Tweet.findByIdAndDelete(tweetID, (err, tweetSuccess) => {
            if (!tweetSuccess) return res.status(400).send({ message: 'No existe el tweet.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweet: tweetSuccess, message: 'Tweet eliminado correctamente.' })
        })
    },
    deleteTweetsByProfileID: (req, res) => {
        const profileID = req.params.id
        Tweet.deleteMany({ profileID }, (err, tweetsSuccess) => {
            if (!tweetsSuccess) return res.status(400).send({ message: 'No existen tweets para este perfil.' })
            if (err) return res.status(500).send({ message: 'No se pudo resolver la peticion.' })
            return res.status(200).send({ tweets: tweetsSuccess, message: 'Tweets eliminados correctamente.' })
        })
    },
}

module.exports = controller