const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    let errors = { email: "", password: "" }

    if (err.message === 'Incorrect Email') {
        errors.email = err.message
    }

    if (err.message === 'Incorrect Password') {
        errors.password = err.message
    }

    if (err.code === 11000) {
        errors.email = "This email is already in use."
        return errors;
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

const secret = 'Khalid Secret'
const maxAge = 3 * 24 * 60 * 60 // in seconds
const createToken = (id) => {
    return jwt.sign({ id }, secret, {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = (req, res) => {
    const { email, password } = req.body;

    User.create({ email: email, password: password }).then((user) => {
        const token = createToken(user._id)
        res.cookie(`jwt`, token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
    }).catch((err) => {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    })
}

module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    User.login(email, password)
        .then((user) => {
            const token = createToken(user._id)
            res.cookie(`jwt`, token, { httpOnly: true, maxAge: maxAge * 1000 })
            res.status(200).json({ user: user._id })
        }).catch((err) => {
            const errors = handleErrors(err)
            res.status(400).json({ errors })
        })
}


module.exports.logout_get = (req, res) => {
    res.cookie(`jwt`, '', { maxAge: 1 })
    res.redirect('/')
}