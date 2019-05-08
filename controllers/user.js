const models = require('../database/models')
const bcrypt = require('bcrypt')
const passport = require('passport')
require('../passport_setup.js')(passport)
const flash = require('connect-flash')

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

module.exports = {
    show_login: function(req, res, next) {
        res.render('user/login', { formData: {}, errors: {}})
    },
    show_signup: function(req, res, next) {
        res.render('user/signup', { formData: {}, errors: {}})
    },
    login: function(req, res, next) {
        passport.authenticate('local', {
            successRedirect:"/",
            failureRedirect:"/login",
            failureFlash: true
        })(req, res, next)
    },
    logout: function(req, res, next) {
        req.logout();
        req.session.destroy()
        req.redirect('/')
    },
    signup: function(req, res, next) {
        const newUser = models.User.build({
            email: req.body.email,
            password: generateHash(req.body.password)
        })
        return newUser.save().then(result => {
            passport.authenticate('local', {
                successRedirect: "/",
                failureRedirect: "/signup",
                failureFlash: true
            })(req, res, next)
        }).catch(error => {
            console.log(error)
            res.redirect('/signup')
        })
    },
}