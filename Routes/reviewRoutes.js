const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const express = require(`express`)
const router = express.Router({ mergeParams: true });
router.use(authController.protect)
router.post('/', authController.restrict('user'), reviewController.setTourAndUserIds, reviewController.reviewTour)
router.get('/', reviewController.getReviews)


router.delete('/:id', authController.restrict('user', 'admin'), reviewController.deleteReview)
router.get('/:id', reviewController.getReview)
router.patch('/:id', authController.restrict('user', 'admin'), reviewController.updateReview)

module.exports = router
