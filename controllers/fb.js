const passport = require('passport')
require('../passport_setup')(passport)

module.exports = {
    login: function(req, res, next)  {
        passport.authenticate('facebook', {
            scope:['email'],
            callbackURL: '/facebook/callback'
        })(req, res, next)
    },

    callback: function(req, res, next) {
        passport.authenticate('facebook', {
            successRedirect:'/',
            failureRedirect:'/login',
            callbackURL: '/facebook/callback',
            scope:['email']
        })(req,res,next)
    }
}