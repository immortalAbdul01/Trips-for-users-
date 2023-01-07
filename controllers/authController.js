const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const crypto = require('crypto')
const User = require('./../Models/userModule')
const sendEmail = require('./../utils/email')
const appError = require('./../utils/app.Error')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN
    })

}
const cookieOption = {
    Expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000),


    HttpOnly: true
}
if (process.env.NODE_ENV === 'production') {
    cookieOption.Secure = true
}
const createToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.cookie('jwt', token, cookieOption)
    res.status(statusCode).json({
        mssg: 'token send sucessfully',
        token
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })
    createToken(newUser, 201, res)



    res.status(201).json({
        mssg: 'sucess',
        token,
        data: {
            user: newUser
        }
    })

})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new appError('please provide a email and password ', 400))
    }

    const user = await User.findOne({
        email: email
    }).select('+password')

    if (!user || ! await user.correctPassword(password, user.password)) {
        return next(new appError('The email or password is incorrect ', 400))
    }


    const token = signToken(user._id)
    res.status(200).json({
        mssg: 'sucess',
        token
    })
})


exports.protect = catchAsync(async (req, res, next) => {
    // Getting the token and checking if it is presnet there or not ?
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new appError('Opps you are not authorized', 401))
    }

    //Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // check if the user still exists
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new appError('The token is no longer exists', 401))
    }

    //check if user changed pass after the token issued

    if (!freshUser.changePassword(decoded.iat)) {
        return next(new appError('User recently changed password check again', 401))
    }

    // GRANT ACESS TO PROTECTED ROUTE
    req.user = freshUser
    next()


}
)
exports.restrict = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('oops you can not delete tours '))
        }
        next()
    }
}
exports.forgotPassword = catchAsync(

    async (req, res, next) => {
        // get the user based on the email
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            next(new appError('you entered incorrect email ', 404))
        }
        // generate a random token

        const resetToken = user.createPasswordRestToken()
        await user.save({ validateBeforeSave: false })

        // send it to the users email
        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/app/v1/users/resetPassword/${resetToken}`
        const message = ` Forgot your password? don't worry reset your password here by clicking the link below ${resetUrl} and if you didn't forgot your password then please ignore this`
        try {

            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for only 2 minutes)',
                message
            })
            res.status(200).json({
                status: 'sucess',
                message: 'Token sent to email'
            })
        } catch (err) {
            user.passwordRestToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })
            console.log(err);
            return next(new appError('failed to send email please try again later', 500))
        }

    }
)
exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        passwordRestToken: hashToken,
        passwordResetExpires: { $gt: Date.now() }

    })

    if (!user) {
        return next(new appError('Wrong token entered ', 501))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordRestToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    const token = signToken(user._id)

    res.status(200).json({
        mssg: 'sucessfully changed password',
        token
    })
})


exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get a user from the collections 
    const user = await User.findById(req.user.id).select('+password')
    if ((await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError('oops your current password is wrong', 401))
    }



    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfrim
    await user.save()

    createToken(user, 200, res);


})
