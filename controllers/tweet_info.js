'use strict'

const Tweet = require('../models/tweet')
const TweetBookmark = require('../models/tweet_bookmark')
const TweetComment = require('../models/tweet_comment')
const TweetLike = require('../models/tweet_like')
const TweetMediaContent = require('../models/tweet_mediacontent')
const TweetRetweet = require('../models/tweet_retweet')
const ProfileFollow = require('../models/profile_follow')

const controller = {
    tweetGeneralInformation: async (req, res) => {
        const tweetID = req.params.id
        const tweet = await Tweet.findById(tweetID)
            .populate([{ path: 'profileID' }, { path: 'tweetReplyOptionID' }])
            .exec()
        const bookmarks = await TweetBookmark.find({ tweetID })
            .populate([{
                path: 'tweetID', populate: [{
                    path: 'tweetReplyOptionID',
                }, {
                    path: 'profileID'
                }]
            }, { path: 'profileID' }])
            .exec()
        const comments = await TweetComment.find({ tweetID })
            .populate([{ path: 'tweetID' }, { path: 'profileID' }])
            .exec()
        const likes = await TweetLike.find({ tweetID })
            .populate([{ path: 'tweetID' }, { path: 'profileID' }])
            .exec()
        const mediaContents = await TweetMediaContent.find({ tweetID })
            .populate({ path: 'tweetID' })
            .exec()
        const retweets = await TweetRetweet.find({ tweetID })
            .populate([{ path: 'tweetID' }, { path: 'profileID' }])
            .exec()
        const tweetInfo = {
            tweetID: tweet._id,
            profleID: tweet.profileID,
            tweetReplyOptionID: tweet.tweetReplyOptionID,
            bookmarks,
            comments,
            likes,
            mediaContents,
            retweets,
        }
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
                const bookmarks = await TweetBookmark.find({ tweetID: tweet._id })
                    .populate([{
                        path: 'tweetID', populate: [{
                            path: 'tweetReplyOptionID',
                        }, {
                            path: 'profileID'
                        }]
                    }, { path: 'profileID' }])
                    .exec()
                const comments = await TweetComment.find({ tweetID: tweet._id })
                    .populate([{ path: 'tweetID' }, { path: 'profileID' }])
                    .exec()
                const likes = await TweetLike.find({ tweetID: tweet._id })
                    .populate([{ path: 'tweetID' }, { path: 'profileID' }])
                    .exec()
                const mediaContents = await TweetMediaContent.find({ tweetID: tweet._id })
                    .populate({ path: 'tweetID' })
                    .exec()
                const retweets = await TweetRetweet.find({ tweetID: tweet._id })
                    .populate([{ path: 'tweetID' }, { path: 'profileID' }])
                    .exec()
                return {
                    tweetID: tweet._id,
                    profileID: tweet.profileID,
                    tweetReplyOptionID: tweet.tweetReplyOptionID,
                    content: tweet.content,
                    bookmarks,
                    comments,
                    likes,
                    mediaContents,
                    retweets,
                }
            })
        )
        return res.status(200).send({ tweetsInfo })
    },
}

module.exports = controller