
const { formatWithCursor } = require('prettier');
const User = require('./../Models/userModule')
const appError = require('./../utils/app.Error')
const factory = require('./../controllers/handlerFacory')
// const fs = require("fs")
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const catchAsync = require('./../utils/catchAsync')
exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User)


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const userDelete = await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: 'sucess',
        mssg: 'hey deleted sucessfully',
        data: null
    })
})
// do not update passwords using these
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)