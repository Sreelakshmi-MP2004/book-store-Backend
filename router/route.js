const express = require('express')

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")

const jwtMiddleware = require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multerMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const route = express.Router()

route.post('/api/register', userController.userRegister)

route.post('/api/login', userController.userLogin)

route.post('/api/google-login', userController.googleLogin)

route.post('/api/addbook', jwtMiddleware, multerConfig.array('UploadedImages', 3), bookController.addBook)

route.post('/api/addBook', bookController.addBook)

route.get('/api/getBooks', jwtMiddleware, bookController.getBooks)

route.get('/api/getHomeBooks', bookController.getHomeBooks)

route.get('/api/viewBooks/:id', jwtMiddleware, bookController.viewBooks)

// Admin side GET User & GET Book
route.get('/api/getUsers', adminMiddleware, userController.getUsers)

route.get('/api/getBooks', adminMiddleware, bookController.getBooks)

// Admin - updation & get
// route.put('/api/update-admin', adminMiddleware, multerConfig.single('profile'),  userController.UpdateAdmin)
// route.put('/api/update-admin', adminMiddleware, multerConfig.single('profile'), userController.adminUpdate)

// route.get('/api/get-admin', adminMiddleware, userController.getAdmin)

// payment
route.put('/api/makePayment', jwtMiddleware, bookController.buyBook)

module.exports = route
