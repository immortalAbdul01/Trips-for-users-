const express = require(`express`)
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController')


const router = express.Router();
// router.param("id",tourController.ChekcId)
router.route('/top-5-cheap').get(tourController.bestTours, tourController.getTours)
router.route('/stats').get(tourController.getToursStats)
router.route('/month/:year').get(tourController.getMonthlyPlan)

router.route('/').get(authController.protect, tourController.getTours).post(tourController.createTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect, authController.restrict('admin', 'lead-guide'), tourController.deleteTour)

module.exports = router