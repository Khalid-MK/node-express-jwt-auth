const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        const secret = 'Khalid Secret'
        jwt.verify(token, secret, (err, result) => {
            if (err) {
                console.log(err.message)
                res.redirect('/login');
            } else {
                console.log(result)
                next();
            }

        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        const secret = 'Khalid Secret'
        jwt.verify(token, secret, async (err, result) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null;
                next();
            } else {
                console.log(result)
                let user = await User.findById(result.id)
                res.locals.user = user;
                next();
            }

        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser }