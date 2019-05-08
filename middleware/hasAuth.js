const createError = require('http-errors')

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            next(createError(404, "Page does not exist"))
        }
    },
    hasAuth: (req, res, next) => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            next(createError(404, "Page does not exist"))
        }
    }
}