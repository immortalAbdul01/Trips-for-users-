const express = require(`express`)
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../Routes/reviewRoutes')


const router = express.Router();
// router.param("id",tourController.ChekcId)
// // 
// router.route('/:tourId/reviews').post(authController.protect, authController.restrict('user'), reviewController.reviewTour)
router.use('/:tourId/reviews', reviewRouter)
router.route('/top-5-cheap').get(tourController.bestTours, tourController.getTours)
router.route('/stats').get(tourController.getToursStats)
router.route('/month/:year').get(authController.protect, authController.restrict('admin', 'lead-guides', 'guides'), tourController.getMonthlyPlan)
//getting location route

router.get('/tours-within/:distance/center/:latlng/unit/:unit', tourController.toursWithin)
router.route('/').get(tourController.getTours).post(authController.protect, authController.restrict('admin'), tourController.createTour)
router.route('/:id').get(tourController.getTour).patch(authController.protect, authController.restrict('admin'), tourController.updateTour).delete(authController.protect, authController.restrict('admin', 'lead-guide'), tourController.deleteTour)


module.exports = router