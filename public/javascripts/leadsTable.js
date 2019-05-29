$(document).ready(function() {
    const socket = io();
    socket.on('add_data', function(data) {
        let newLead = JSON.parse(data)
        let child = document.createElement("tr")
        child.id = newLead.id
        
        //email
        let emailEle = document.createElement('td')
        let emailSpan = document.createElement('span')
        emailSpan.innerHTML = newLead.email
        emailEle.innerHTML = emailSpan.outerHTML

        //Detail link
        let detailEle = document.createElement('td')
        let detailLink = document.createElement('a')
        detailLink.href = '/lead/' + newLead.id
        detailLink.innerHTML = 'Details'
        detailEle.innerHTML = detailLink.outerHTML

        //delete button
        let deleteEle = document.createElement('td')
        let deleteButton = document.createElement('button')
        deleteButton.classList.add('btn')
        deleteButton.classList.add('btn-primary')
        deleteButton.innerHTML = Delete
        deleteButton.onclick = `deleteLead('` + newLead.id + `')`
        deleteEle.innerHTML = deleteButton.outerHTML

        child.innerHTML = emailEle.outerHTML + detailEle.outerHTML + deleteEle.outerHTML
        $('#leadsTable tbody').append(child.outerHTML)
    })
    socket.on('delete_data', function(data) {
        console.log(data)
    })
    socket.on('update_data', function(data) {
        console.log(data)
    })
})