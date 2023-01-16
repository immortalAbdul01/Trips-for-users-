const express = require('express')
const router = express.Router()
const viewController = require('./../controllers/viewController')

router.get('/', viewController.getOverview)
router.get('/tour/:slug', viewController.getTour)

<<<<<<< HEAD

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;

module.exports = router
=======
module.exports = router
>>>>>>> parent of 5c52af9 (changed everything)
