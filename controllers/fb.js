const passport = require('passport')
require('../passport_setup')(passport)

module.exports = {
    login: function(req, res, next)  {
        passport.authenticate('facebook', {scope:['email']})(req, res, next)
    },

    callback: function(req, res, next) {
        passport.authenticate('facebook', {
            successRedirect:'/',
            failureRedirect:'/login',
            scope:['email']
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