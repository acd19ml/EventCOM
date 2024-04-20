document.addEventListener('DOMContentLoaded', function() {
    fetchAttendees();

    document.getElementById('clearStaffs').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all staff members?')) {
            deleteAttendeesByRole('Staff');
        }
    });

    document.getElementById('clearStudents').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all students?')) {
            deleteAttendeesByRole('Student');
        }
    });
});

function fetchAttendees() {
    fetch('http://localhost:8000/api/attendees/', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
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
            } else {
                response.text().then(text => alert(text)); // Display error message from server
            }
        }).catch(error => console.error('Error deleting attendee:', error));
    }
}



// function deleteAttendeesByRole(role) {
//     fetch(`http://localhost:8000/api/attendees/deleteByRole/${role}`, {
//         method: 'DELETE',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }).then(response => {
//         if (response.ok) {
//             alert(`${role}s deleted successfully`);
//             fetchAttendees(); // Refresh the list
//         }
//     }).catch(error => console.error(`Error deleting ${role}s:`, error));
// }
