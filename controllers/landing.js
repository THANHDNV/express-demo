const models = require('../database/models')

exports.get_landing = function(req, res, next) {
    res.render('landing', { title: 'Express' });
}

exports.submit_lead = function(req, res, next) {
    return models.Lead.create({
        email: req.body.lead_email
    }).then(lead => {
        let io = req.app.get('socketio')
        io.sockets.emit('add_data', JSON.stringify(lead))
        res.redirect('/leads')
    })
}

exports.show_leads = function(req, res, next) {
    return models.Lead.findAll().then(leads => {
        res.render('lead/leads', { title: 'Express', leads: leads })
    })
}

exports.show_lead = function(req, res, next) {
    return models.Lead.findOne({
        where: {
            id: req.params.lead_id
        }
    }).then(lead => {
        res.render('lead/lead', { title: 'Express', lead: lead})
    })
}

exports.show_edit_lead = function(req, res, next) {
    return models.Lead.findOne({
        where: {
            id: req.params.lead_id
        }
    }).then(lead => {
        res.render('lead/edit_lead', { title: 'Express', lead: lead})
    })
}

exports.edit_lead = function(req, res, next) {
    return models.Lead.update({
        email: req.body.lead_email
    }, {
        where: {
            id: req.params.lead_id
        },

    }).then(result => {
        let io = req.app.get('socketio')
        io.sockets.emit('update_data', JSON.stringify({
            id: req.params.lead_id,
            email: req.body.lead_email
        }))
        res.redirect('/lead/' + req.params.lead_id)
    })
}

exports.delete_lead = function(req,res,next) {
    return models.Lead.destroy({
        where: {
            id: req.params.lead_id
        }
    }).then(result => {
        let io = req.app.get('socketio')
        io.sockets.emit('delete_data', JSON.stringify({
            id: req.params.lead_id
        }))
        res.redirect('/leads')
    })
}

exports.delete_lead_json = function(req,res,next) {
    return models.Lead.destroy({
        where: {
            id: req.params.lead_id
        }
    }).then(result => {
        let io = req.app.get('socketio')
        io.sockets.emit('delete_data', JSON.stringify({
            id: req.params.lead_id
        }))
        res.send({ msg: 'Success'})
    })
}