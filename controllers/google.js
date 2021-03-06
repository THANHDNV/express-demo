const passport = require('passport')
require('../passport_setup')(passport)

module.exports = {
    login: (req,res,next) => {
        return passport.authenticate('google', {
            scope: ['profile', 'email'],
            callbackURL: '/google/callback'
        })(req,res,next)
    },
    callback: (req,res,next) => {
        return passport.authenticate('google', {
            successRedirect:'/',
            failureRedirect:'/login',
            scope: ['profile', 'email'],
            callbackURL: '/google/callback'
        })(req,res,next)
    }
}