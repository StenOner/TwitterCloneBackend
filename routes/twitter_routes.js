'use strict'

const express = require('express')
const AuthController = require('../controllers/auth')
const UserController = require('../controllers/user')
const ProfileController = require('../controllers/profile')
const ProfileFollowController = require('../controllers/profile_follow')
const TweetController = require('../controllers/tweet')
const TweetReplyOptionController = require('../controllers/tweet_reply_option')
const TweetBookmarkController = require('../controllers/tweet_bookmark')
const TweetCommentMediaContentController = require('../controllers/tweet_comment_mediacontent')
const TweetCommentController = require('../controllers/tweet_comment')
const TweetLikeController = require('../controllers/tweet_like')
const TweetCommentLikeController = require('../controllers/tweet_comment_like')
const TweetMediacontentController = require('../controllers/tweet_mediacontent')
const TweetMentionController = require('../controllers/tweet_mention')
const TweetTrendController = require('../controllers/tweet_trend')
const TweetRetweetController = require('../controllers/tweet_retweet')
const TweetInfoController = require('../controllers/tweet_info')
const UploadController = require('../controllers/upload')
const WhotToFollowController = require('../controllers/who_to_follow')
const router = express.Router()
const multer = require('multer')

const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp']

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp')
    },
    filename: (req, file, cb) => {
        const name = file.originalname
        const index = name.lastIndexOf('.')
        const fileExt = index > 0 ? name.substring(index) : ''
        cb(null, `${Date.now()}${fileExt}`)
    }
})
const filterProfilePicture = (req, file, cb) => {
    const acceptedExtensions = imageExtensions
    const name = file.originalname
    const index = name.lastIndexOf('.')
    const fileExt = index > 0 ? name.substring(index + 1) : ''
    if (!acceptedExtensions.includes(fileExt.toLowerCase())) cb('La extension no es soportada.')
    cb(null, true)
}
const limitProfilePicture = {
    fileSize: 5 * 1024 * 1024
}
const filterProfileBanner = (req, file, cb) => {
    const acceptedExtensions = imageExtensions
    const name = file.originalname
    const index = name.lastIndexOf('.')
    const fileExt = index > 0 ? name.substring(index + 1) : ''
    if (!acceptedExtensions.includes(fileExt.toLowerCase())) cb('La extension no es soportada.')
    cb(null, true)
}
const limitProfileBanner = {
    fileSize: 20 * 1024 * 1024
}
const filterMediaContent = (req, file, cb) => {
    const acceptedExtensions = imageExtensions
    const name = file.originalname
    const index = name.lastIndexOf('.')
    const fileExt = index > 0 ? name.substring(index + 1) : ''
    if (!acceptedExtensions.includes(fileExt.toLowerCase())) cb('La extension no es soportada.')
    cb(null, true)
}
const limitMediaContent = {
    fileSize: 10 * 1024 * 1024
}
const uploadProfilePicture = multer({ storage: storage, limits: limitProfilePicture, fileFilter: filterProfilePicture })
const uploadProfileBanner = multer({ storage: storage, limits: limitProfileBanner, fileFilter: filterProfileBanner })
const uploadMediaContent = multer({ storage: storage, limits: limitMediaContent, fileFilter: filterMediaContent })

const authMiddleware = require('../middlewares/validateToken')
const authValidation = require('../middlewares/validateAuth')
const userValidation = require('../middlewares/validateUser')
const profileValidation = require('../middlewares/validateProfile')
const profileFollowValidation = require('../middlewares/validateProfileFollow')
const tweetValidation = require('../middlewares/validateTweet')
const fileValidation = require('../middlewares/validateFile')

router.post('/auth', authValidation.authValidate, AuthController.auth)
router.post('/auth/refresh', authValidation.refreshValidate, AuthController.refreshToken)
router.post('/auth/logout', AuthController.logout)

router.post('/users', userValidation.fullValidate, UserController.newUser)
router.get('/users/:id', authMiddleware, UserController.user)
router.get('/users', authMiddleware, UserController.users)
router.put('/users/:id', authMiddleware, userValidation.noPasswordValidate, UserController.updateUser)
router.put('/users/:id/email', authMiddleware, userValidation.updateEmailValidate, UserController.updateUserEmail)
router.put('/users/:id/password', authMiddleware, userValidation.updatePasswordValidate, UserController.updateUserPassword)
router.post('/users/delete', authMiddleware, userValidation.deleteUserValidate, UserController.deleteUser)

router.post('/profiles', authMiddleware, profileValidation.fullValidate, ProfileController.newProfile)
router.get('/profiles/:id', authMiddleware, ProfileController.profile)
router.get('/profiles', authMiddleware, ProfileController.profiles)
router.get('/profiles/users/:id', authMiddleware, ProfileController.profileByUserID)
router.put('/profiles/:id', authMiddleware, profileValidation.fullValidate, profileValidation.updateValidate, ProfileController.updateProfile)
router.delete('/profiles/:id', authMiddleware, ProfileController.deleteProfile)

router.post('/profiles-follows', authMiddleware, profileFollowValidation.fullValidate, profileFollowValidation.sameProfileValidate, ProfileFollowController.newProfileFollow)
router.get('/profiles-follows/:id', authMiddleware, ProfileFollowController.profileFollow)
router.get('/profiles-followers/:followingid', authMiddleware, ProfileFollowController.profileFollowers)
router.get('/profiles-following/:followerid', authMiddleware, ProfileFollowController.profileFollowing)
router.delete('/profiles-follows/:id', authMiddleware, ProfileFollowController.deleteProfileFollow)

router.post('/tweets', authMiddleware, tweetValidation.fullValidate, TweetController.newTweet)
router.get('/tweets/:id', authMiddleware, TweetController.tweet)
router.get('/tweets', authMiddleware, TweetController.tweets)
router.get('/tweets/profiles/:id', authMiddleware, TweetController.tweetsByProfileID)
router.get('/tweets/profiles-following/:id', authMiddleware, TweetController.followingTweetsByProfileID)
router.delete('/tweets/:id', authMiddleware, TweetController.deleteTweet)
router.delete('/tweets/profiles/:id', authMiddleware, TweetController.deleteTweetsByProfileID)

router.get('/tweets-reply-options/:id', authMiddleware, TweetReplyOptionController.TweetReplyOption)
router.get('/tweets-reply-options', authMiddleware, TweetReplyOptionController.TweetReplyOptions)

router.post('/tweets-bookmarks', authMiddleware, TweetBookmarkController.newTweetBookmark)
router.get('/tweets-bookmarks/:id', authMiddleware, TweetBookmarkController.tweetBookmark)
router.get('/tweets-bookmarks/tweets/:id', authMiddleware, TweetBookmarkController.tweetBookmarksByTweetID)
router.get('/tweets-bookmarks/profiles/:id', authMiddleware, TweetBookmarkController.tweetBookmarksByProfileID)
router.delete('/tweets-bookmarks/:id', authMiddleware, TweetBookmarkController.deleteTweetBookmark)
router.delete('/tweets-bookmarks/tweets/:id', authMiddleware, TweetBookmarkController.deleteTweetBookmarksByTweetID)
router.delete('/tweets-bookmarks/profiles/:id', authMiddleware, TweetBookmarkController.deleteTweetBookmarksByProfileID)

router.post('/tweets-comments-mediacontents', authMiddleware, TweetCommentMediaContentController.newTweetCommentMediacontent)
router.get('/tweets-comments-mediacontents/:id', authMiddleware, TweetCommentMediaContentController.tweetCommentMediacontent)
router.get('/tweets-comments-mediacontents/tweets-comments/:id', authMiddleware, TweetCommentMediaContentController.tweetCommentMediacontentsByTweetCommentID)
router.delete('/tweets-comments-mediacontents/:id', authMiddleware, TweetCommentMediaContentController.deleteTweetCommentMediacontent)
router.delete('/tweets-comments-mediacontents/tweets-comments/:id', authMiddleware, TweetCommentMediaContentController.deleteTweetCommentMediacontentsByTweetCommentID)

router.post('/tweets-comments', authMiddleware, TweetCommentController.newTweetComment)
router.get('/tweets-comments/:id', authMiddleware, TweetCommentController.tweetComment)
router.get('/tweets-comments/tweets/:id', authMiddleware, TweetCommentController.tweetCommentsByTweetID)
router.get('/tweets-comments/profiles/:id', authMiddleware, TweetCommentController.tweetCommentsByProfileID)
router.delete('/tweets-comments/:id', authMiddleware, TweetCommentController.deleteTweetComment)
router.delete('/tweets-comments/tweets/:id', authMiddleware, TweetCommentController.deleteTweetCommentsByTweetID)
router.delete('/tweets-comments/profiles/:id', authMiddleware, TweetCommentController.deleteTweetCommentsByProfileID)

router.post('/tweets-likes', authMiddleware, TweetLikeController.newTweetLike)
router.get('/tweets-likes/:id', authMiddleware, TweetLikeController.tweetLike)
router.get('/tweets-likes/tweets/:id', authMiddleware, TweetLikeController.tweetLikesByTweetID)
router.get('/tweets-likes/profiles/:id', authMiddleware, TweetLikeController.tweetLikesByProfileID)
router.delete('/tweets-likes/:id', authMiddleware, TweetLikeController.deleteTweetLike)
router.delete('/tweets-likes/tweets/:id', authMiddleware, TweetLikeController.deleteTweetLikesByTweetID)
router.delete('/tweets-likes/profiles/:id', authMiddleware, TweetLikeController.deleteTweetLikesByProfileID)

router.post('/tweets-comments-likes', authMiddleware, TweetCommentLikeController.newTweetCommentLike)
router.get('/tweets-comments-likes/:id', authMiddleware, TweetCommentLikeController.tweetCommentLike)
router.get('/tweets-comments-likes/comments/:id', authMiddleware, TweetCommentLikeController.tweetCommentLikesByTweetCommentID)
router.get('/tweets-comments-likes/profiles/:id', authMiddleware, TweetCommentLikeController.tweetCommentLikesByProfileID)
router.delete('/tweets-comments-likes/:id', authMiddleware, TweetCommentLikeController.deleteTweetCommentLike)
router.delete('/tweets-comments-likes/comments/:id', authMiddleware, TweetCommentLikeController.deleteTweetCommentLikesByTweetCommentID)
router.delete('/tweets-comments-likes/profiles/:id', authMiddleware, TweetCommentLikeController.deleteTweetCommentLikesByProfileID)

router.post('/tweets-mediacontents', authMiddleware, TweetMediacontentController.newTweetMediacontent)
router.get('/tweets-mediacontents/:id', authMiddleware, TweetMediacontentController.tweetMediacontent)
router.get('/tweets-mediacontents/tweets/:id', authMiddleware, TweetMediacontentController.tweetMediacontentsByTweetID)
router.delete('/tweets-mediacontents/:id', authMiddleware, TweetMediacontentController.deleteTweetMediacontent)
router.delete('/tweets-mediacontents/tweets/:id', authMiddleware, TweetMediacontentController.deleteTweetMediacontentsByTweetID)

router.post('/tweets-mentions', authMiddleware, TweetMentionController.newTweetMention)
router.get('/tweets-mentions/:id', authMiddleware, TweetMentionController.TweetMention)
router.get('/tweets-mentions', authMiddleware, TweetMentionController.TweetMentions)
router.get('/tweets-mentions/tweets/:id', authMiddleware, TweetMentionController.TweetMentionsByTweetID)
router.delete('/tweets-mentions/:id', authMiddleware, TweetMentionController.deleteTweetMention)
router.delete('/tweets-mentions/tweets/:id', authMiddleware, TweetMentionController.deleteTweetMentionsByTweetID)

router.post('/tweets-trends', authMiddleware, TweetTrendController.newTweetTrend)
router.get('/tweets-trends/:id', authMiddleware, TweetTrendController.TweetTrend)
router.get('/tweets-trends', authMiddleware, TweetTrendController.TweetTrends)
router.get('/tweets-trends/tweets/:id', authMiddleware, TweetTrendController.TweetTrendsByTweetID)
router.delete('/tweets-trends/:id', authMiddleware, TweetTrendController.deleteTweetTrend)
router.delete('/tweets-trends/tweets/:id', authMiddleware, TweetTrendController.deleteTweetTrendsByTweetID)

router.post('/tweets-retweets', authMiddleware, TweetRetweetController.newTweetRetweet)
router.get('/tweets-retweets/:id', authMiddleware, TweetRetweetController.tweetRetweet)
router.get('/tweets-retweets/tweets/:id', authMiddleware, TweetRetweetController.tweetRetweetsByTweetID)
router.get('/tweets-retweets/profiles/:id', authMiddleware, TweetRetweetController.tweetRetweetsByProfileID)
router.delete('/tweets-retweets/:id', authMiddleware, TweetRetweetController.deleteTweetRetweet)
router.delete('/tweets-retweets/tweets/:id', authMiddleware, TweetRetweetController.deleteTweetRetweetsByTweetID)
router.delete('/tweets-retweets/profiles/:id', authMiddleware, TweetRetweetController.deleteTweetRetweetsByProfileID)

router.get('/tweets-info/tweets/:id', authMiddleware, TweetInfoController.tweetGeneralInformation)
router.get('/tweets-info/tweets/profiles-following/:id', authMiddleware, TweetInfoController.followingTweetsGeneralInformationByProfileID)
router.get('/who-to-follow/:id', authMiddleware, WhotToFollowController.whoToFollow)

router.put('/upload/profile-banner', authMiddleware, uploadProfileBanner.single('profileBanner'), fileValidation.fileValidate, fileValidation.profileValidate, UploadController.uploadProfileBanner)
router.put('/upload/profile-picture', authMiddleware, uploadProfilePicture.single('profilePicture'), fileValidation.fileValidate, fileValidation.profileValidate, UploadController.uploadProfilePicture)
router.put('/upload/tweet-image', authMiddleware, uploadMediaContent.single('tweetImage'), fileValidation.fileValidate, fileValidation.tweetMediaContentValidate, UploadController.uploadTweetImage)
router.put('/upload/comment-image', authMiddleware, uploadMediaContent.single('commentImage'), fileValidation.fileValidate, fileValidation.tweetCommentMediaContentValidate, UploadController.uploadTweetCommentImage)
router.get('/download/:file', UploadController.downloadFile)

module.exports = router