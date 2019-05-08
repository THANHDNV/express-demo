const validator = require('validator')
const models = require('../database/models')

const validateCreateUserField = (errors, req) => {
    if (!validator.isEmail(req.body.email)) {
        errors['email'] = 'Please use a valid email'
    }
    if (!validator.isAscii(req.body.password)) {
        errors['password'] = 'Invalid characters in password. Please try another one.'
    }
    if (!validator.isLength(req.body.password, { min: 8, max: 25})) {
        errors['password'] = 'Please ensure your password has a minimum of 8 characters and maximum of 25 characters'
    }
}

module.exports = {
    validateUser: (errors, req) => {
        return new Promise((resolve, reject) => {
            validateCreateUserField(errors, req)
            return models.User.findOne({
                where: {
                    'email': req.body.email
                }
            }).then(user => {
                if (user !== null) {
                    errors['email'] = "Email is already in use. Please login or reset your password."
                }
                resolve(errors)
            })
        })
    }
}