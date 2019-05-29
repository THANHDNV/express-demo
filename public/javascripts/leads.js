function deleteLead(leadId) {
    $.ajax({
        url: '/lead/' + leadId + '/delete-json',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({leadId}),
        type: 'POST',
        success: (res) => {
            $('#' + leadId).remove()
        },
        error: error => {
            console.log("Error: ", error)
        }
    })
}