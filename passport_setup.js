let localStrategy = require('passport-local').Strategy
let facebookStrategy = require('passport-facebook').Strategy
let googleStrategy = require('passport-google-oauth').OAuth2Strategy

let config = null
try {
    config = require('./config/config')
} catch (error) {
    
}
const Op = require('sequelize').Op

const crypto = require('crypto')
let bcrypt = require('bcrypt')
let models = require('./database/models')

const decrypt = function(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(new Buffer('ThiSiSaRaNdOmkeYThiSiSaRaNdOmkeY')), new Buffer('tHIsIsACIpHErtHI'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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
        clientID: config ? config.facebook_api_key : decrypt(process.env.FB_KEY) ,
        clientSecret: config ? config.facebook_api_secret : decrypt(process.env.FB_SECRET),
        profileFields: ['id', 'emails', 'name']
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        if (!profile.id) {
            return done(null, false)
        }
        return models.User.findOne({
            where: {
                [Op.or]: [
                    {
                        SocialId: profile.id,
                        SocialType: 'fb'
                    },
                    {
                        email: profile.emails[0].value
                    }
                ]
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
                return done(null, user)
            }
        }).catch(err => {
            return done(err, null)
        })
    }))
    passport.use (new googleStrategy({
        clientID: config ? config.google_client_id : decrypt(process.env.GG_KEY),
        clientSecret: config ? config.google_secret : decrypt(process.env.GG_SECRET),
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        if (!profile.id) {
            return done(null, false)
        }
        models.User.findOne({
            where: {
                [Op.or]: [
                    {
                        SocialId: profile.id,
                        SocialType: 'google'
                    },
                    {
                        email: profile.emails[0].value
                    }
                ]
            }
        }).then(user => {
            if (!user) {
                let newUser = models.User.build({
                    email: profile.emails[0].value,
                    password: accessToken,
                    SocialType: 'google',
                    SocialId: profile.id
                })
                return newUser.save().then(result => {
                    return done(null, newUser)
                })
            } else {
                return done(null, user)
            }
        }).catch(error => {
            return done(error, null)
        })
    }))
}