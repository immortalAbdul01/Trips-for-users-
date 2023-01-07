const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const express = require('express')

const router = express.Router()
router.route('/').get(userController.getAllUsers)
// .post(userController.addUser)
// router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser)
router.route('/signUp').post(authController.signUp)
router.route('/login').post(authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)
router.patch('/updatePassword', authController.updatePassword)
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe)
module.exports = router