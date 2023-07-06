'use strict'

require('dotenv').config()
const fs = require('fs')
const multer = require('multer')
const { v2: cloudinary, v2: { uploader } } = require('cloudinary')
const streamifier = require('streamifier')

let canWrite = false
try {
    fs.accessSync('./tmp', fs.constants.W_OK)
    canWrite = true
}
catch (err) {
    console.log('Local File Storage:', err.message)
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
    if (!validExtensions.includes(fileExt.toLowerCase())) return cb('La extension no es soportada.')
    cb(null, true)
}
const uploadProfileBanner = multer({ storage: storage, limits: limitProfileBanner, fileFilter })
const uploadProfilePicture = multer({ storage: storage, limits: limitProfilePicture, fileFilter })
const uploadMediaContent = multer({ storage: storage, limits: limitMediaContent, fileFilter })

const uploadProfileBannerMemory = multer({ limits: limitProfileBanner, fileFilter })
const uploadProfilePictureMemory = multer({ limits: limitProfilePicture, fileFilter })
const uploadMediaContentMemory = multer({ limits: limitMediaContent, fileFilter })

const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        const stream = uploader.upload_stream((err, res) => {
            if (res) resolve(res)
            else reject(err)
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
    })
}

const fileUploadValidation = {
    uploadSingleProfileBanner: (req, res, next) => {
        const uploadSingle = canWrite ? uploadProfileBanner.single('profileBanner') : uploadProfileBannerMemory.single('profileBanner')
        uploadSingle(req, res, async (err) => {
            if (err) return res.status(422).send({ message: err })
            if (!canWrite) {
                const result = await streamUpload(req)
                req.cloudinary_url = result.secure_url
            }
            next()
        })
    },
    uploadSingleProfilePicture: (req, res, next) => {
        const uploadSingle = canWrite ? uploadProfilePicture.single('profilePicture') : uploadProfilePictureMemory.single('profilePicture')
        uploadSingle(req, res, async (err) => {
            if (err) return res.status(422).send({ message: err })
            if (!canWrite) {
                const result = await streamUpload(req)
                req.cloudinary_url = result.secure_url
            }
            next()
        })
    },
    uploadSingleTweetImage: (req, res, next) => {
        const uploadSingle = canWrite ? uploadMediaContent.single('tweetImage') : uploadMediaContentMemory.single('tweetImage')
        uploadSingle(req, res, async (err) => {
            if (err) return res.status(422).send({ message: err })
            if (!canWrite) {
                const result = await streamUpload(req)
                req.cloudinary_url = result.secure_url
            }
            next()
        })
    },
    uploadSingleCommentImage: (req, res, next) => {
        const uploadSingle = canWrite ? uploadMediaContent.single('commentImage') : uploadMediaContentMemory.single('commentImage')
        uploadSingle(req, res, async (err) => {
            if (err) return res.status(422).send({ message: err })
            if (!canWrite) {
                const result = await streamUpload(req)
                req.cloudinary_url = result.secure_url
            }
            next()
        })
    },
}


module.exports = fileUploadValidation