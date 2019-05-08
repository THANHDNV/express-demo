const models = require('../database/models')
const bcrypt = require('bcrypt')
const passport = require('passport')
require('../passport_setup.js')(passport)
const flash = require('connect-flash')
const { validateUser } = require('../validators/signup')
const { isEmpty } = require('lodash')

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const rerender_signup = function(errors, req, res, next) {
    res.render('user/signup', { formData: req.body, errors })
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
        res.redirect('/')
    },
    signup: function(req, res, next) {
        let errors = {}
        return validateUser(errors, req).then(errors => {
            if (!isEmpty(errors)) {
                return rerender_signup(errors, req, res, next)
            } else {
                return models.user.findOne({
                    where: {
                        isAdmin: true
                    }
                }).then(user => {
                    let newUser;
                    if (user !== null) {
                        newUser = models.User.build({
                            email: req.body.email,
                            password: generateHash(req.body.password)
                        })
                    } else {
                        newUser = models.User.build({
                            email: req.body.email,
                            password: generateHash(req.body.password),
                            isAdmin: true
                        })
                    }
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
                })
            }
        })

        
    },
}