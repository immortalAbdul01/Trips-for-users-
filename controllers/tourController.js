const Tour = require('./../Models/tourModel')
// const fs = require("fs")

const apiFeatures = require('./../utils/appFeature')
const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/app.Error')
// const tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))



exports.bestTours = (req, res, next) => {
    req.query.limit = '9',
        req.query.sort = '-ratingsAverage',
        req.query.fields = 'name,price,summary,ratings'
    next()
}


exports.getTours = catchAsync(async (req, res, next) => {
    const features = new apiFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .fields()
        .pagenation();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

exports.createTour = catchAsync(async (req, res, next) => {


    const newTour = await Tour.create(req.body)
    res.status(200).json({
        mssg: "sucessfully created",
        data: newTour
    })
}

)
exports.getTour = catchAsync(async (req, res, next) => {




    const tour = await Tour.findById(req.params.id)

    if (!tour) {
        return next(new appError('oops tour not found ', 404))
    }

    res.status(200).json({
        mssg: 'Here we are sending you the perfect response',
        time: req.requestTime,
        data: {
            newTour: tour
        }

    }
    )


})
exports.assignTour = catchAsync(

    (req, res, next) => {


        res.status(201).json({
            mssg: 'sucessfully created a new file',
            newTour
        })

    }
)
exports.updateTour = catchAsync(

    async (req, res, next) => {


        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,

        })

        if (!tour) {
            return next(new appError('Oops tour not found ', 404))
        }

        res.status(200).json({
            mssg: 'hii there we are using patch method ',
            data: {
                tour
            }
        })


    }

)

exports.deleteTour = catchAsync(

    async (req, res, next) => {

        await Tour.findByIdAndDelete(req.params.id)


        res.status(204).json({
            mssg: "deleted sucessfully",
            data: null
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