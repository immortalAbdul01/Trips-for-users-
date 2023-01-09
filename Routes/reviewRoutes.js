const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const express = require(`express`)
const router = express.Router({ mergeParams: true });

router.post('/', authController.protect, authController.restrict('user'), reviewController.reviewTour)
router.get('/', reviewController.getReviews)

router.delete('/:id', reviewController.deleteReview)

module.exports = router
