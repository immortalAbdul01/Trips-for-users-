const appError = require('./../utils/app.Error')
sendErrDev = (err, res) => {
    res.status(err.statusCode).json({
        mssg: err.mssg,
        status: err.status,
        error: err,
        stack: err.stack
    })

}
handleCastErr = err => {
    const mssg = `Invalid ${err.path} for ${err.value}`
    return new appError(mssg, 404)
}
const handleJWTerror = err => new appError('invalid json token please login again', 401)
const handleJWTexpired = err => new appError('Your token has been expired', 401)
sendErrProd = (err, res) => {
    // operational trusted error should be visible to client 
    if (err.isOperational) {

        res.status(err.statusCode).json({
            mssg: err.mssg,
            status: err.status
        })
        // programming or other error should be hidden from the client 
    } else {
        // log the error to understand it better 
        console.log('ERROR', err);
        res.status(500).json({
            mssg: 'something went wrong in development'
        })
    }

}
module.exports = (err, req, res, next) => {

    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500
    err.mssg = err.mssg || `'opps can't able to find`

    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let errort = { ...err }
        if (errort.name === 'CastError') {
            errort = handleCastErr(errort)
        }
        if (errort.name === 'JsonWebTokenError') errort = handleJWTerror(errort)
        if (errort.name === 'TokenExpiredError') errort = handleJWTexpired(errort)
        sendErrProd(errort, res)
    }

}