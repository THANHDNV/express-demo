module.exports = {
    show_login: function(req, res, next) {
        res.render('user/login', { formData: {}, errors: {}})
    },
    show_signup: function(req, res, next) {
        res.render('user/signup', { formData: {}, errors: {}})
    }
}