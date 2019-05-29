$(document).ready(function() {
    const socket = io();
    socket.on('add_data', function(data) {
        let newLead = JSON.parse(data)
        createDataRow(newLead)
    })
    socket.on('delete_data', function(data) {
        let lead = JSON.parse(data)
        $('#' + lead.id).remove()
    })
    socket.on('update_data', function(data) {
        let lead = JSON.parse(data)
        $('#' + lead.id).remove()
        createDataRow(lead)
    })
})

function createDataRow(data) {
    let child = $('</tr><tr>')
    child.attr('id', data.id)
    
    //email
    let emailSpan = $('<span></span>')
    emailSpan.text(data.email)
    let emailEle = $('<td></td>').append(emailSpan)

    //Detail link
    let detailLink = $('<a></a>')
    detailLink.text('Details')
    detailLink.attr('href', '/lead/' + data.id)
    let detailEle = $('<td></td>').append(detailLink)

    //delete button
    let deleteButton = $('<button></button>')
    deleteButton.addClass('btn')
    deleteButton.addClass('btn-primary')
    deleteButton.text('Delete')
    let deleteEle = $('<td></td>').append(deleteButton)

    child.append(emailEle)
    child.append(detailEle)
    child.append(deleteEle)
    $('#leadsTable tbody').append(child)
    deleteButton.on('click', function() {
        deleteLead(data.id)
    })
}