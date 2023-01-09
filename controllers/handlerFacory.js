const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/app.Error')
const apiFeatures = require('./../utils/appFeature')

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
        return next(new appError('oops the document not found', 404))
    }
    res.status(204).json({
        mssg: 'sucess',
        data: null
    })
})

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {


        const doc = await Model.create(req.body)
        res.status(200).json({
            mssg: "sucessfully created",
            data: doc
        })
    }

    )
exports.updateOne = Model => catchAsync(

    async (req, res, next) => {


        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,

        })

        if (!doc) {
            return next(new appError('Oops doc not found ', 404))
        }

        res.status(200).json({
            mssg: 'hii there we are using patch method ',
            data: {
                doc
            }
        })


    }

)



exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    // const doc = await Model.findById(req.params.id).populate('reviews')

    if (!doc) {
        return next(new appError('oops tour not found ', 404))
    }

    res.status(200).json({
        mssg: 'Here we are sending you the perfect response',
        time: req.requestTime,
        data: {
            data: doc
        }

    }
    )


})

exports.getAll = Model => catchAsync(async (req, res, next) => {
    // this is only to allow nested reviews a simple hack
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }
    const features = new apiFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .fields()
        .pagenation();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
});
