'use strict'

const fs = require('fs')

const helper = {
    dataURLFromLocalFile: (file) => {
        const contentType = helper.getExtensionFromFile(file)
        const bitmap = fs.readFileSync(file)
        const base64 = Buffer.from(bitmap).toString('base64')
        return `data:image/${contentType}base64,${base64}`
    },
    getExtensionFromFile: (file) => {
        const index = file.lastIndexOf('.')
        const ext = file.substring(index + 1)
        if (ext == 'jpg' || ext == 'jpeg') return 'jpeg'
        if (ext == 'png') return 'png'
        return ext
    },
    deleteFileAfter: (filePath, fileName, minutes = 60) => {
        const timeUntilDelete = minutes * 60 * 1000
        setTimeout(() => {
            fs.stat(filePath, (err, stats) => {
                if (!stats) return console.log(`${helper.getFullTime()} - No se encontro el archivo.`)
                if (err) return console.log(`${helper.getFullTime()} - Error al buscar el archivo.`)
                fs.unlink(filePath, (err) => {
                    if (err) return console.log(`${helper.getFullTime()} - No se logro borrar el archivo ${fileName}.`)
                    return console.log(`${helper.getFullTime()} - Se borro el archivo ${fileName} exitosamente.`)
                })
            })
        }, timeUntilDelete)
    },
    getFullTime: () => {
        const date = new Date()
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString().padStart(4, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }
}

module.exports = helper