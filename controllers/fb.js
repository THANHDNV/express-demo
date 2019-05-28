const passport = require('passport')
require('../passport_setup')(passport)

module.exports = {
    login: function(req, res, next)  {
        passport.authenticate('facebook', {scope:['email']}, (error,user) => {
            req.redirect('/fb/callback')
        })(req, res, next)
    },

    callback: function(req, res, next) {
        passport.authenticate('facebook', {
            successRedirect:'/',
            failureRedirect:'/login',
            scope:['email']
        })(req,res,next)
    }
}