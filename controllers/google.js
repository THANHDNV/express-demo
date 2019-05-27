const passport = require('passport')
require('../passport_setup')(passport)

module.exports = {
    login: (req,res,next) => {
        return passport.authenticate('google', {
            scope: ['profile', 'email']
        })(req,res,next)
    },
    callback: (req,res,next) => {
        return passport.authenticate('google', {
            // successRedirect:'/',
            // failureRedirect:'/login',
            scope: ['profile', 'email']
        }, (error, user) => {
            if (error) {
                res.redirect('/login')
            } else {
                const token = jwt.sign({
                    username: user.email
                })
                res.cookie('token',token, {
                    maxAge: 86400 * 2
                }).redirect('/')
            }
        })(req,res,next)
    }
}