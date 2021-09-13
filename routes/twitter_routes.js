'use strict'

const express = require('express')
const AuthController = require('../controllers/auth')
const UserController = require('../controllers/user')
const ProfileController = require('../controllers/profile')
const ProfileFollowController = require('../controllers/profile_follow')
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

router.put('/upload/profile-picture', authMiddleware, uploadProfilePicture.single('profilePicture'), fileValidation.fileValidate, UploadController.uploadProfilePicture)
router.put('/upload/profile-banner', authMiddleware, uploadProfileBanner.single('profileBanner'), fileValidation.fileValidate, UploadController.uploadProfileBanner)
router.get('/download/:file', UploadController.downloadFile)

module.exports = router