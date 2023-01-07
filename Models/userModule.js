const mongoose = require('mongoose')
const crypto = require('crypto')
const validator = require('validator')
const bcrypt = require('bcryptjs')
// name , email , password , photo , password confirm
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'please tell us your name ']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail]
        },
        photo: {
            type: String,

        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false

        },
        passwordConfirm: {
            type: String,
            required: true,
            validate:
            // This only works on save 
            {
                validator: function (el) {
                    return el === this.password

                },
                message: 'The Passwords are not same '
            }


        },
        role: {
            type: String,
            default: 'user',
            enum: {
                values: ['user', 'guide', 'lead-guide', 'admin'],
                message: 'Roles must be user ,guide or lead-guide,admin'
            }



        },
        passwordChangeAt: Date,
        passwordRestToken: String,
        passwordResetExpires: Date,
        updatePassword: String,
        active: {
            type: Boolean,
            default: true
        }


    }
)
userSchema.pre('save', async function (next) {
    // only run this if the password was actually modified
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.changePassword = async function (JWTTimeStamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );

        return JWTTimeStamp < changedTimestamp
    }
    return false
}
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next()
    }
    this.passwordChangeAt = Date.now() - 1000
    next()
})
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next()
})

userSchema.methods.createPasswordRestToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordRestToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    console.log({ resetToken }, this.passwordRestToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}
const UpdatedUsers = mongoose.model('UpdatedUsers', userSchema)
module.exports = UpdatedUsers