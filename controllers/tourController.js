const Tour = require('./../Models/tourModel')
// const fs = require("fs")

const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/app.Error')
const factory = require('./../controllers/handlerFacory')
// const tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))



exports.bestTours = (req, res, next) => {
    req.query.limit = '9',
        req.query.sort = '-ratingsAverage',
        req.query.fields = 'name,price,summary,ratings'
    next()
}


exports.getTours = factory.getAll(Tour)
exports.createTour = factory.createOne(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.updateTour = factory.updateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)
exports.assignTour = catchAsync(

    (req, res, next) => {


        res.status(201).json({
            mssg: 'sucessfully created a new file',
            newTour
        })

    }
)
exports.getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 1 } }
        },
        {
            $group: {
                _id: '$no',
                avgRating: {
                    $avg:
                        '$ratingsAverage'
                },
                numRatings: { $sum: '$ratingsQuantity' },
                numTours: { $sum: 1 },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' }

            }

        }

    ])

    res.status(200).json({
        mssg: 'hey indeed ',
        data: stats
    })
}
)
exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        }
        , {
            $match: {

                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year}-12-01`)
                },




            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                noOfTours: { $sum: 1 },
                nameOfTours: { $push: '$name' }

            }

        },
        {
            $addFields: {
                month: '$_id'
            }

        },
        {

            $sort: {
                noOfTours: -1
            }
        }, {
            $limit: 12
        }


    ])

}
)