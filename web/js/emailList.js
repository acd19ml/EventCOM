document.addEventListener('DOMContentLoaded', function() {
    fetchAttendees();
});

function fetchAttendees() {
    fetch('http://localhost:8000/api/attendees/', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();  
        } else if (response.status === 401) {
            alert('Your session has expired Please click here to log in again.');
            window.location.href = '/login.html';            
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        // Check the response structure and extract the attendees array
        if (data.status === 'success' && Array.isArray(data.data)) {
            renderAttendees(data.data);  // Pass the attendees array to the rendering function
        } else {
            console.error('Unexpected data format:', data);
        }
    })
    .catch(error => console.error('Error fetching attendees:', error));
}

function renderAttendees(attendees) {
    const table = document.getElementById('attendeesTable');
    table.innerHTML = ''; // Clear existing entries
    attendees.forEach(attendee => {
        // Extract the ID directly from the 'id' field
        const attendeeId = attendee.id;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${attendee.email}</td>
            <td>${attendee.role}</td>
            <td>${attendee.interests.join(', ')}</td>
            <td>${attendee.status}</td>
            <td>${attendeeId ? `<button class="btn btn-danger" onclick="deleteAttendee('${attendeeId}')">Delete</button>` : 'No valid ID'}</td>
        `;
        table.appendChild(row);
    });
}





function deleteAttendee(id) {
    if (!id) {
        alert('Cannot delete this attendee because a valid ID is not provided.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this attendee?')) {
        fetch(`http://localhost:8000/api/attendees/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Attendee deleted successfully');
                fetchAttendees(); // Refresh the list
            } else if (response.status === 401) {
                alert('Your session has expired Please click here to log in again.');
                window.location.href = '/login.html';            
            } else {
                response.text().then(text => alert(text)); // Display error message from server
            }
        }).catch(error => console.error('Error deleting attendee:', error));
    }
}
