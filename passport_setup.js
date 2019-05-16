let localStrategy = require('passport-local').Strategy
let facebookStrategy = require('passport-facebook').Strategy
const config = require('./config/config')

let bcrypt = require('bcrypt')
let models = require('./database/models')

const validPassword = function(user, password) {
    return bcrypt.compareSync(password, user.password)
}
module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        models.User.findOne({
            where: {
                'id': id
            }
        }).then(user => {
            if (user == null) {
                done(new Error('Wrong user id'))
            }
            done(null, user)
        })
    })

    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        return models.User.findOne({
            where: {
                'email': email
            }
        }).then(user => {
            if (user == null) {
                req.flash('message', 'Incorrect credentials')
                return done(null, false)
            } else if (user.password ==  null || user.password == undefined) {
                req.flash('message', 'You must reset your password')
                return done(null, false)
            } else if (!validPassword(user, password)) {
                req.flash('message', 'Incorrect credentials')
                return done(null, false)
            }
            return done(null, user)
        }).catch(err => {done(err, false)})
    }))
    
    passport.use( new facebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret: config.facebook_api_secret,
        callbackURL: config.callback_url,
        profileFields: ['id', 'emails', 'name']
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        if (!profile.id) {
            return done(null, false)
        }
        return models.User.findOne({
            where: {
                SocialId: profile.id,
                SocialType: 'fb'
            }
        }).then(user => {
            if (!user) {
                let newUser = models.User.build({
                    email: profile.emails[0].value,
                    password: accessToken,
                    SocialType: 'fb',
                    SocialId: profile.id
                })
                return newUser.save().then(result => {
                    return done(null, newUser)
                })
            } else {
                console.log(user)
                return done(null, user)
            }
        }).catch(err => {
            return done(err, null)
        })
        
    }))
}