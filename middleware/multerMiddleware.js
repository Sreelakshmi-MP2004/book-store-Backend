// Multer middleware - Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.


// 1. import multer
const multer = require('multer')

// 2. Setup of destination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads') // manually created file
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Data.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `IMG-${file.originalname}`)
    }
})

// 3. File filter creation
function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted



    // To accept the file pass `true`, like so:
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') {
        cb(null, true)
    } else {
        // To reject this file pass `false`, like so:
        cb(null, false)

         return  cb(new Error('I don\'t have a clue!'))

    }
    // You can always pass an error if something goes wrong:

}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports=multerConfig
