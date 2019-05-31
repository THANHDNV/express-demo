$(document).ready(function() {
    const socket = io()
    socket.on('update_data', function(data) {
        let lead = JSON.parse(data)
        $('table tbody tr:first-child td:nth-child(2) span').text(lead.email)
    })

    socket.on('delete_data', function(data) {
        
    })
})