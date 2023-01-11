const mongo = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const UpdatedUsers = require('./../Models/userModule')
const tourSchema = new mongo.Schema(
    {
        name: {

            type: String,
            required: [true, 'a tour must have a name'],
            unique: true,
            maxlength: [40, 'tour should be less than 40 chars']
            ,
            minlength: [10, 'a tour must be greater that 10 chars'],

        },

        duration: {
            type: Number,
            required: [true, 'a tour must have a duration']

        },
        maxGroupSize: {
            type: Number,
            required: [true, 'a tour must have a group size']

        },
        difficulty: {
            type: String,
            required: [true, 'a tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty muse be easy , medium or difficult'
            }
        }
        ,
        ratingsAverage: {
            type: Number,
            unique: false,
            min: [1, 'a rating must be atLeast 1'],
            max: [5, 'your rating must be less than 5'],
            set: val => Math.round(val * 10) / 10


        },
        ratingsQuantity: {

            type: Number,
            unique: false
        }
        ,
        priceDiscount: {
            type: Number,
            validate: function (val) {
                return val < this.price
            }

        },

        summary: {
            type: String,
            trim: true,
            required: [true, 'a tour must have a summary']
        }
        ,
        description: {
            type: String,
            trim: true
        },
        slug: String
        ,
        imageCover: {
            type: String,
            required: [true, 'a tour must have a image covers']
        }
        ,
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now()
        }
        ,
        startDates: [Date]
        ,
        secretTour: Boolean,


        startLocation: {
            //Geo JSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']

            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']

            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        },
        price: {
            type: Number,
            // required:true


        },
        guides: Array,

        rating: {
            type: Number,
            default: 4.5,


        }

    }
    , {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

tourSchema.virtual('durationInWeeks').get(function () {
    return this.duration / 7
})
// DOCUMENT MIDDLE WARE FUNCTION runs before .save() and .create()

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

tourSchema.post('save', function (doc, next) {
    console.log(doc);
    next()
})
// indexing the start location

tourSchema.index({ startLocation: '2dsphere' })
// query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()

})

// tourSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'guides'
//     })
//     next()

// })
tourSchema.pre('save', async function (next) {
    const guidePromises = this.guides.map(async id => await UpdatedUsers.findById(id))
    this.guides = await Promise.all(guidePromises)
    next()
})
// Virtual populate 
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})
tourSchema.post(/^find/, function (doc, next) {
    console.log(`It took approx clear${Date.now() - this.start} ms`);
    console.log(doc);
    next()

})

tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
// Aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//     console.log(this.pipeline());
//     next()
// })
const Trips = mongo.model('Trips', tourSchema)
module.exports = Trips
