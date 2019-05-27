const jwt = require('jsonwebtoken')
const fs = require('fs')

const publicKey = fs.readFileSync('./key/public.key', 'utf8')
const privateKey = fs.readFileSync('./key/private.key', 'utf8')

module.exports = {
    sign: (payload, options) => {
        let signOptions = {
            issuer: options ? options.issuer : null,
            subject: options ? options.subject : null,
            audience: options ? options.audience : null,
            expiresIn: '2d',
            notBefore: Date.now()
        }
        return jwt.sign(payload, privateKey, signOptions)
    },

    verify: (token, options) => {
        let verifyOptions = {
            issuer: options ? options.issuer : null,
            subject: options ? options.subject : null,
            audience: options ? options.audience : null,
            expiresIn: '2d',
            notBefore: Date.now()
        }
        try {
            return jwt.verify(token, publicKey, verifyOptions)
        } catch(error) {
            return false
        }
    },

    decode: (token) => {
        return jwt.decode(token, { complete: true })
    }
}