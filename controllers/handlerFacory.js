const catchAsync = require('./../utils/catchAsync')
const appError = require('./../utils/app.Error')
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