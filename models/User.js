const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: [true, "Email is already taken."],
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [4, "Password minimum length is 4."],
    }
})

// fire function after doc saved to database.
userSchema.post('save', function (doc, next) {
    console.log(`user saved successfully, ${doc}`)
    next();
})

// fire function before doc saved to database.
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static function to login user
userSchema.statics.login = async function (email, password) {

    const user = await this.findOne({ email: email })

    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email");
}

const User = mongoose.model('User', userSchema)

module.exports = User