'use strict'

const ProfileFollow = require('../models/profile_follow')
const TweetBookmark = require('../models/tweet_bookmark')
const TweetComment = require('../models/tweet_comment')
const TweetLike = require('../models/tweet_like')
const TweetMediaContent = require('../models/tweet_mediacontent')
const TweetCommentMediaContent = require('../models/tweet_comment_mediacontent')
const TweetCommentLike = require('../models/tweet_comment_like')
const TweetRetweet = require('../models/tweet_retweet')

exports.getTweetInfo = async function (tweet) {
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
    const commentsInfo = await Promise.all(
        comments.map(async (comment) => {
            const commentMediaContents = await TweetCommentMediaContent.find({ tweetCommentID: comment._id })
                .exec()
            const commentLikes = await TweetCommentLike.find({ tweetCommentID: comment._id })
                .populate([{ path: 'tweetCommentID' }, { path: 'profileID' }])
                .sort({ createdAt: 'desc' })
                .exec()
            return {
                ...comment._doc,
                likes: commentLikes,
                mediaContents: commentMediaContents,
            }
        })
    )
    const likes = await TweetLike.find({ tweetID: tweet._id })
        .populate([{ path: 'tweetID' }, { path: 'profileID' }])
        .exec()
    const mediaContents = await TweetMediaContent.find({ tweetID: tweet._id })
        .populate({ path: 'tweetID' })
        .exec()
    const retweets = await TweetRetweet.find({ tweetID: tweet._id })
        .populate([{ path: 'tweetID' }, { path: 'profileID' }])
        .exec()
    const profileFollowers = await ProfileFollow.find({ followingProfileID: tweet.profileID._id })
        .populate([{ path: 'followingProfileID', select: '-userID' }, { path: 'followerProfileID', select: '-userID' }])
        .exec()
    const profile = {
        ...tweet.profileID._doc,
        followers: profileFollowers,
    }

    return {
        tweetID: tweet._id,
        createdAt: tweet.createdAt,
        profileID: profile,
        tweetReplyOptionID: tweet.tweetReplyOptionID,
        content: tweet.content,
        bookmarks,
        comments: commentsInfo,
        likes,
        mediaContents,
        retweets,
    }
}