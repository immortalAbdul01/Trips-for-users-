const Review = require('./../Models/reviewModel')

const catchAsync = require('./../utils/catchAsync')
exports.reviewTour = catchAsync(async (req, res, next) => {
    const reviews = await Review.create(req.body)
    res.status(201).json({
        mssg: 'sucess',
        revies: reviews
    })

})
exports.getReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find()
    res.status(200).json({
        mssg: 'sucess',
        data: reviews
    })
})