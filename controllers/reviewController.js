const Review = require('./../Models/reviewModel')
const factory = require('./../controllers/handlerFacory')
const catchAsync = require('./../utils/catchAsync')

exports.setTourAndUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

exports.reviewTour = factory.createOne(Review)
exports.getReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)