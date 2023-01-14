const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const reviewRouter = require('./Routes/reviewRoutes')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const xss_clean = require('xss-clean')
const tourRouter = require('./Routes/tourRoutes')
const path = require('path')
const userRouter = require('./Routes/userRoutes')
const appError = require('./utils/app.Error')
const cookie_parser = require('cookie-parser')
const errorController = require('./controllers/errorController')
const viewRoute = require('./Routes/viewRoutes')

const app = express()
// app.use(helmet())
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NOSQL query injection
app.use(mongoSanitize())
// app.use(mongoSanitize())
app.use(xss_clean())
// It prevents parameter polution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAvg']
}))
// Thats how we use third party modules

app.use(morgan('dev')) // It takes a string as a argument 
// Using middleware which applies to each and every request present here
app.use((req, res, next) => {
    console.log('Hello from middle ware ');
    next()
})
app.use(cookie_parser());


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log(req.headers);
    next()

})

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many request please try again later'
})
app.use('/app', limiter)


app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/app/v1/tours',getTours)


// app.get('/app/v1/tours/:id',getTour)



// app.post('/app/v1/tours',assignTour)



// // update method by using patch 
// app.patch('/app/v1/tours/:id',updateTour)


// // Deleting method from 
// app.delete('/app/v1/tours/:id',deleteTour)



// one more method to or the easiest method to execute these stuffs 


app.use('/', viewRoute)
app.use('/app/v1/tours', tourRouter)
app.use('/app/v1/users', userRouter)
app.use('/app/v1/review', reviewRouter)

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     msssg: `oops can't find such file ${req.originalUrl}Instead try this /app/v1/tours`
    // })
    // const err = new Error(`can't find the ${req.originalUrl} try some other options`)
    // err.status = 'fail'
    // err.statusCode = 404
    next(new appError(`'oops can't find the request at ${req.originalUrl}`, 404))
})

app.use(errorController)
module.exports = app