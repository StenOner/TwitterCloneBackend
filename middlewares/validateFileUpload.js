'use strict'
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
const limitProfileBanner = {
    fileSize: 20 * 1024 * 1024
}
const limitProfilePicture = {
    fileSize: 5 * 1024 * 1024
}
const limitMediaContent = {
    fileSize: 10 * 1024 * 1024
}
const fileFilter = (req, file, cb) => {
    const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp']
    const name = file.originalname
    const index = name.lastIndexOf('.')
    const fileExt = index > 0 ? name.substring(index + 1) : ''
    if (!validExtensions.includes(fileExt.toLowerCase())) cb('La extension no es soportada.')
    cb(null, true)
}
const uploadProfileBanner = multer({ storage: storage, limits: limitProfileBanner, fileFilter })
const uploadProfilePicture = multer({ storage: storage, limits: limitProfilePicture, fileFilter })
const uploadMediaContent = multer({ storage: storage, limits: limitMediaContent, fileFilter })

const fileUploadValidation = {
    uploadSingleProfileBanner: (req, res, next) => {
        const upload = uploadProfileBanner.single('profileBanner')
        upload(req, res, (err) => {
            if (err) return res.status(422).send({ message: err })
            next()
        })
    },
    uploadSingleProfilePicture: (req, res, next) => {
        const upload = uploadProfilePicture.single('profilePicture')
        upload(req, res, (err) => {
            if (err) return res.status(422).send({ message: err })
            next()
        })
    },
    uploadSingleTweetImage: (req, res, next) => {
        const upload = uploadMediaContent.single('tweetImage')
        upload(req, res, (err) => {
            if (err) return res.status(422).send({ message: err })
            next()
        })
    },
    uploadSingleCommentImage: (req, res, next) => {
        const upload = uploadMediaContent.single('commentImage')
        upload(req, res, (err) => {
            if (err) return res.status(422).send({ message: err })
            next()
        })
    },
}


module.exports = fileUploadValidation