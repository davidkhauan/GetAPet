const Multer = require ('multer')
const Path = require ('path')

const imageStorage = Multer.diskStorage ({
    destination: function (requisition, file, callback) {
        let folder = ""

        if (requisition.baseUrl.includes ("users")) {
            folder = "users"
        } else if (requisition.baseUrl.includes ("pets")) {
            folder = "pets"
        }

        callback (null, `public/images/${folder}`)
    },
    filename: function (requisition, file, callback) {
        callback (null, Date.now() + Path.extname (file.originalname))
    }
})

const ImageUploadHelper = Multer ({
    storage: imageStorage,
    fileFilter (requisition, file, callback) {
        if (!file.originalname.match (/\.(png|jpg|jpeg)$/)) {
            return callback (new Error ('Formato inválido! Envie apenas PNG, JPG ou JPEG!'))
        }

        callback (undefined, true)
    }
})

module.exports = { ImageUploadHelper }