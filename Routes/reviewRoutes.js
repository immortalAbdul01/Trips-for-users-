const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const express = require(`express`)
const router = express.Router({ mergeParams: true });

router.post('/', authController.protect, authController.restrict('user'), reviewController.setTourAndUserIds, reviewController.reviewTour)
router.get('/', reviewController.getReviews)


router.delete('/:id', reviewController.deleteReview)
router.get('/:id', reviewController.getReview)
router.patch('/:id', reviewController.updateReview)

module.exports = router
