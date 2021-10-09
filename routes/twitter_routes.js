'use strict'

const express = require('express')
const AuthController = require('../controllers/auth')
const UserController = require('../controllers/user')
const ProfileController = require('../controllers/profile')
const ProfileFollowController = require('../controllers/profile_follow')
const TweetController = require('../controllers/tweet')
const TweetBookmarkController = require('../controllers/tweet_bookmark')
const TweetCommentController = require('../controllers/tweet_comment')
const TweetLikeController = require('../controllers/tweet_like')
const TweetMediacontentController = require('../controllers/tweet_mediacontent')
const TweetRetweetController = require('../controllers/tweet_retweet')
const UploadController = require('../controllers/upload')
const router = express.Router()
const multer = require('multer')

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
    const acceptedExtensions = ['jpeg', 'jpg', 'png', 'gif']
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
    const acceptedExtensions = ['jpeg', 'jpg', 'png', 'gif']
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
    const acceptedExtensions = ['jpeg', 'jpg', 'png', 'gif']
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
router.put('/profiles/:id', profileValidation.fullValidate, authMiddleware, ProfileController.updateProfile)
router.delete('/profiles/:id', authMiddleware, ProfileController.deleteProfile)

router.post('/profiles-follows', authMiddleware, profileFollowValidation.fullValidate, profileFollowValidation.sameProfileValidate, ProfileFollowController.newProfileFollow)
router.get('/profiles-follows/:id', authMiddleware, ProfileFollowController.profileFollow)
router.get('/profiles-followers/:followingid', authMiddleware, ProfileFollowController.profileFollowers)
router.get('/profiles-following/:followerid', authMiddleware, ProfileFollowController.profileFollowing)
router.delete('/profiles-follows/:id', authMiddleware, ProfileFollowController.deleteProfileFollow)

router.post('/tweets', authMiddleware, TweetController.newTweet)
router.get('/tweets/:id', authMiddleware, TweetController.tweet)
router.get('/tweets', authMiddleware, TweetController.tweets)
router.get('/tweets/profiles/:id', authMiddleware, TweetController.tweetsByProfileID)
router.delete('/tweets/:id', authMiddleware, TweetController.deleteTweet)
router.delete('/tweets/profiles/:id', authMiddleware, TweetController.deleteTweetsByProfileID)

router.post('/tweets-bookmarks', authMiddleware, TweetBookmarkController.newTweetBookmark)
router.get('/tweets-bookmarks/:id', authMiddleware, TweetBookmarkController.tweetBookmark)
router.get('/tweets-bookmarks/tweets/:id', authMiddleware, TweetBookmarkController.tweetBookmarksByTweetID)
router.get('/tweets-bookmarks/profiles/:id', authMiddleware, TweetBookmarkController.tweetBookmarksByProfileID)
router.delete('/tweets-bookmarks/:id', authMiddleware, TweetBookmarkController.deleteTweetBookmark)
router.delete('/tweets-bookmarks/tweets/:id', authMiddleware, TweetBookmarkController.deleteTweetBookmarksByTweetID)
router.delete('/tweets-bookmarks/profiles/:id', authMiddleware, TweetBookmarkController.deleteTweetBookmarksByProfileID)

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

router.post('/tweets-mediacontents', authMiddleware, TweetMediacontentController.newTweetMediacontent)
router.get('/tweets-mediacontents/:id', authMiddleware, TweetMediacontentController.tweetMediacontent)
router.get('/tweets-mediacontents/tweets/:id', authMiddleware, TweetMediacontentController.tweetMediacontentsByTweetID)
router.delete('/tweets-mediacontents/:id', authMiddleware, TweetMediacontentController.deleteTweetMediacontent)
router.delete('/tweets-mediacontents/tweets/:id', authMiddleware, TweetMediacontentController.deleteTweetMediacontentsByTweetID)

router.post('/tweets-retweets', authMiddleware, TweetRetweetController.newTweetRetweet)
router.get('/tweets-retweets/:id', authMiddleware, TweetRetweetController.tweetRetweet)
router.get('/tweets-retweets/tweets/:id', authMiddleware, TweetRetweetController.tweetRetweetsByTweetID)
router.get('/tweets-retweets/profiles/:id', authMiddleware, TweetRetweetController.tweetRetweetsByProfileID)
router.delete('/tweets-retweets/:id', authMiddleware, TweetRetweetController.deleteTweetRetweet)
router.delete('/tweets-retweets/tweets/:id', authMiddleware, TweetRetweetController.deleteTweetRetweetsByTweetID)
router.delete('/tweets-retweets/profiles/:id', authMiddleware, TweetRetweetController.deleteTweetRetweetsByProfileID)

router.put('/upload/profile-picture', authMiddleware, uploadProfilePicture.single('profilePicture'), fileValidation.fileValidate, fileValidation.profileValidate, UploadController.uploadProfilePicture)
router.put('/upload/profile-banner', authMiddleware, uploadProfileBanner.single('profileBanner'), fileValidation.fileValidate, fileValidation.profileValidate, UploadController.uploadProfileBanner)
router.put('/upload/tweet-image', authMiddleware, uploadMediaContent.single('tweetImage'), fileValidation.fileValidate, fileValidation.tweetMediaContentValidate, UploadController.uploadTweetImage)
router.put('/upload/comment-image', authMiddleware, uploadMediaContent.single('commentImage'), fileValidation.fileValidate, fileValidation.tweetCommentMediaContentValidate, UploadController.uploadTweetCommentImage)
router.get('/download/:file', UploadController.downloadFile)

module.exports = router