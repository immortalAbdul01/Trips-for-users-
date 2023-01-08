const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const express = require(`express`)
const router = express.Router();

router.post('/', authController.protect, authController.restrict('user'), reviewController.reviewTour)
router.get('/', reviewController.getReviews)

module.exports = router
