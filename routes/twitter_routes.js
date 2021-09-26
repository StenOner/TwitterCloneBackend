'use strict'

const express = require('express')
const AuthController = require('../controllers/auth')
const UserController = require('../controllers/user')
const ProfileController = require('../controllers/profile')
const ProfileFollowController = require('../controllers/profile_follow')
const TweetController = require('../controllers/tweet')
const TweetCommentController = require('../controllers/tweet_comment')
const TweetLikeController = require('../controllers/tweet_like')
const TweetMediaContentController = require('../controllers/tweet_media-content')
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
const uploadProfilePicture = multer({ storage: storage, limits: limitProfilePicture, fileFilter: filterProfilePicture })
const uploadProfileBanner = multer({ storage: storage, limits: limitProfileBanner, fileFilter: filterProfileBanner })

const authMiddleware = require('../middlewares/validateToken')
const authValidation = require('../middlewares/validateAuth')
const userValidation = require('../middlewares/validateUser')
const profileValidation = require('../middlewares/validateProfile')
const profileFollowValidation = require('../middlewares/validateProfileFollow')
const fileValidation = require('../middlewares/validateFile')

router.post('/auth', authValidation.authValidate, AuthController.auth)
router.post('/refresh-auth', authValidation.refreshValidate, AuthController.refreshToken)
router.post('/logout', AuthController.logout)

router.post('/user/new', userValidation.fullValidate, UserController.newUser)
router.get('/user/:id', authMiddleware, UserController.user)
router.get('/users', authMiddleware, UserController.users)
router.put('/user/:id/update', authMiddleware, userValidation.noPasswordValidate, UserController.updateUser)
router.put('/user-email/update', authMiddleware, userValidation.updateEmailValidate, UserController.updateUserEmail)
router.put('/user-password/update', authMiddleware, userValidation.updatePasswordValidate, UserController.updateUserPassword)
router.post('/user/delete', authMiddleware, userValidation.deleteUserValidate, UserController.deleteUser)

router.post('/profile/new', authMiddleware, profileValidation.fullValidate, ProfileController.newProfile)
router.get('/profile/:id', authMiddleware, ProfileController.profile)
router.get('/profiles', authMiddleware, ProfileController.profiles)
router.get('/profile-by-user/:id', authMiddleware, ProfileController.profileByUserID)
router.put('/profile/:id/update', profileValidation.fullValidate, authMiddleware, ProfileController.updateProfile)
router.delete('/profile/:id/delete', authMiddleware, ProfileController.deleteProfile)

router.post('/profile-follow/new', authMiddleware, profileFollowValidation.fullValidate, profileFollowValidation.sameProfileValidate, ProfileFollowController.newProfileFollow)
router.get('/profile-follow/:id', authMiddleware, ProfileFollowController.profileFollow)
router.get('/profile-followers/:followingid', authMiddleware, ProfileFollowController.profileFollowers)
router.get('/profile-following/:followerid', authMiddleware, ProfileFollowController.profileFollowing)
router.delete('/profile-follow/:id/delete', authMiddleware, ProfileFollowController.deleteProfileFollow)

router.post('/tweet/new', authMiddleware, TweetController.newTweet)
router.get('/tweet/:id', authMiddleware, TweetController.tweet)
router.get('/tweets', authMiddleware, TweetController.tweets)
router.get('/tweets-by-profile/:id', authMiddleware, TweetController.tweetsByProfileID)
router.delete('/tweet/:id/delete', authMiddleware, TweetController.deleteTweet)
router.delete('/tweets-by-profile/:id/delete', authMiddleware, TweetController.deleteTweetsByProfileID)

router.post('/tweet-comment/new', authMiddleware, TweetCommentController.newTweetComment)
router.get('/tweet-comment/:id', authMiddleware, TweetCommentController.tweetComment)
router.get('/tweet-comments-by-tweet/:id', authMiddleware, TweetCommentController.tweetCommentsByTweetID)
router.get('/tweet-comments-by-profile/:id', authMiddleware, TweetCommentController.tweetCommentsByProfileID)
router.delete('/tweet-comment/:id/delete', authMiddleware, TweetCommentController.deleteTweetComment)
router.delete('/tweet-comments-by-tweet/:id/delete', authMiddleware, TweetCommentController.deleteTweetCommentsByTweetID)
router.delete('/tweet-comments-by-profile/:id/delete', authMiddleware, TweetCommentController.deleteTweetCommentsByProfileID)

router.post('/tweet-like/new', authMiddleware, TweetLikeController.newTweetLike)
router.get('/tweet-like/:id', authMiddleware, TweetLikeController.tweetLike)
router.get('/tweet-likes-by-tweet/:id', authMiddleware, TweetLikeController.tweetLikesByTweetID)
router.get('/tweet-likes-by-profile/:id', authMiddleware, TweetLikeController.tweetLikesByProfileID)
router.delete('/tweet-like/:id/delete', authMiddleware, TweetLikeController.deleteTweetLike)
router.delete('/tweet-likes-by-tweet/:id/delete', authMiddleware, TweetLikeController.deleteTweetLikesByTweetID)
router.delete('/tweet-likes-by-profile/:id/delete', authMiddleware, TweetLikeController.deleteTweetLikesByProfileID)

router.post('/tweet-media-content/new', authMiddleware, TweetMediaContentController.newTweetMediaContent)
router.get('/tweet-media-content/:id', authMiddleware, TweetMediaContentController.tweetMediaContent)
router.get('/tweet-media-contents-by-tweet/:id', authMiddleware, TweetMediaContentController.tweetMediaContentsByTweetID)
router.delete('/tweet-media-content/:id/delete', authMiddleware, TweetMediaContentController.deleteTweetMediaContent)
router.delete('/tweet-media-contents-by-tweet/:id/delete', authMiddleware, TweetMediaContentController.deleteTweetMediaContentsByTweetID)

router.post('/tweet-retweet/new', authMiddleware, TweetRetweetController.newTweetRetweet)
router.get('/tweet-retweet/:id', authMiddleware, TweetRetweetController.tweetRetweet)
router.get('/tweet-retweets-by-tweet/:id', authMiddleware, TweetRetweetController.tweetRetweetsByTweetID)
router.get('/tweet-retweets-by-profile/:id', authMiddleware, TweetRetweetController.tweetRetweetsByProfileID)
router.delete('/tweet-retweet/:id/delete', authMiddleware, TweetRetweetController.deleteTweetRetweet)
router.delete('/tweet-retweets-by-tweet/:id/delete', authMiddleware, TweetRetweetController.deleteTweetRetweetsByTweetID)
router.delete('/tweet-retweets-by-profile/:id/delete', authMiddleware, TweetRetweetController.deleteTweetRetweetsByProfileID)

router.put('/upload/profile-picture', authMiddleware, uploadProfilePicture.single('profilePicture'), fileValidation.fileValidate, UploadController.uploadProfilePicture)
router.put('/upload/profile-banner', authMiddleware, uploadProfileBanner.single('profileBanner'), fileValidation.fileValidate, UploadController.uploadProfileBanner)
router.get('/download/:file', UploadController.downloadFile)

module.exports = router