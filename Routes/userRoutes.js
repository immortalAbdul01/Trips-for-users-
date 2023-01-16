const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const express = require('express')

const router = express.Router()
router.route('/signUp').post(authController.signUp)
router.patch('/resetPassword/:token', authController.resetPassword)
router.route('/login').post(authController.login)

// this is a protecting middle ware 
router.use(authController.protect)

router.post('/forgotPassword', authController.forgotPassword)
router.route('/me').get(authController.protect, userController.getMe, userController.getUser)

router.patch('/updatePassword', authController.updatePassword)
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

// this is a protecting and restricting middle ware 
router.use(authController.restrict('admin'))

router.route('/').get(userController.getAllUsers)
router.patch('/:id', authController.restrict('admin'), userController.updateUser)
router.route('/:id').get(userController.getUser)
module.exports = router