var editDateModal = new bootstrap.Modal(document.getElementById('editDateModal'), {
    keyboard: true // Allow closing with the keyboard 'Esc' key
  });

// Function to populate dates into the DOM
function populateDates(dates) {
    const datesList = document.getElementById('datesList');
    datesList.innerHTML = ''; // Clear the list before repopulating

    dates.forEach(date => {
        const dateRow = `
            <div class="row mb-2">
                <div class="col">${date.date}</div>
                <div class="col">${date.detail}</div>
                <div class="col">
                    <button class="btn btn-primary edit-btn" data-id="${date.id}" data-toggle="modal" data-target="#editDateModal">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${date.id}">Delete</button>
                </div>
            </div>
        `;
        datesList.innerHTML += dateRow;
    });
}  
// Function to fetch and populate dates
function fetchDates() {
    fetch('http://localhost:8000/api/dates/')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                populateDates(data.data);
            } else {
                throw new Error('Failed to fetch dates');
            }
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer components
    fetch('./components/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            headerPlaceholder.innerHTML = data;
        });

    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            footerPlaceholder.innerHTML = data;
        });

    

    

    // Event listener for form submission
    const addDateForm = document.getElementById('addDateForm');
    addDateForm.addEventListener('submit', event => {
        event.preventDefault();

        const newDate = document.getElementById('newDateInput').value;
        const detail = document.getElementById('detailSelect').value;

        fetch('http://localhost:8000/api/dates/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: newDate, detail: detail }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();  // 处理成功的响应
            } else if (response.status === 401) {
                window.location.href = '/login.html';  // 未登录，重定向到登录页面
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            if (data.status === 'success') {
                console.log('Date added:', data);
                fetchDates(); // Re-fetch dates to update the list
            } else {
                throw new Error('Failed to add date');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to delete a date
    function deleteDate(dateId) {
        if (!confirm("Are you sure you want to delete this date?")) {
            return;
        }

        fetch(`http://localhost:8000/api/dates/${dateId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                return response.json();  // 处理成功的响应
            } else if (response.status === 401) {
                window.location.href = '/login.html';  // 未登录，重定向到登录页面
            } else if (response.status === 204) {
                console.log('Date deleted successfully');
                fetchDates(); // Re-fetch dates to update the list
            } else {
                throw new Error('Something went wrong');
            }
        })
        .catch(error => console.error('Error deleting date:', error));
    }

    // Event delegation for delete buttons
    document.body.addEventListener('click', event => {
        if (event.target.classList.contains('delete-btn')) {
            const dateId = event.target.getAttribute('data-id');
            deleteDate(dateId);
        }
    });

    // Initial fetch of dates
    fetchDates();

    
});

// Event delegation for edit buttons
document.body.addEventListener('click', event => {
    if (event.target.classList.contains('edit-btn')) {
        const dateId = event.target.getAttribute('data-id');
        // Populate the modal form fields with the date details
        populateEditForm(dateId);
        // Trigger the modal to open
        editDateModal.show();
          
    }
});

function getAllDetails() {
    return fetch('http://localhost:8000/api/dates')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Extract details and remove undefined or null values
                const details = data.data
                    .map(date => date.detail)
                    .filter((value, index, self) => value && self.indexOf(value) === index);
                return details; // Return an array of unique details
            } else {
                throw new Error('Failed to fetch details');
            }
        })
        .catch(error => {
            console.error('Error fetching details:', error);
            return []; // Return an empty array in case of error
        });
}

function setDetailSelectOptions(selectedDetail) {
    const details = ["Talk from Industry", "COM Founder's Club Talk"]; // Static list of details
    const selectElement = document.getElementById('editDetailSelect');
    selectElement.innerHTML = ''; // Clears existing options

    details.forEach(detail => {
        const isSelected = detail === selectedDetail;
        const optionElement = new Option(detail, detail, isSelected, isSelected);
        selectElement.add(optionElement);
    });
}



function populateEditForm(dateId) {
    // Fetch the specific date details
    fetch(`http://localhost:8000/api/dates/${dateId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Populate form fields
                document.getElementById('editDateInput').value = data.data.date;
                
                // Set the select options and mark the current detail as selected
                setDetailSelectOptions(data.data.detail);
                
                document.getElementById('editDateId').value = dateId;
            } else {
                throw new Error('Failed to fetch date details');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Save changes button in modal
document.getElementById('saveDateChanges').addEventListener('click', () => {
    const dateId = document.getElementById('editDateId').value;
    const editedDate = document.getElementById('editDateInput').value;
    const editedDetail = document.getElementById('editDetailSelect').value;
    updateDate(dateId, editedDate, editedDetail);
});

function updateDate(dateId, date, detail) {
    fetch(`http://localhost:8000/api/dates/${dateId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, detail }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // 处理成功的响应
        } else if (response.status === 401) {
            window.location.href = '/login.html';  // 未登录，重定向到登录页面
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        if (data.status === 'success') {
            console.log('Date updated:', data);
            editDateModal.hide(); // Hide the modal after successful update
            fetchDates(); // Re-fetch dates to update the list
        } else {
            console.error('Failed to update date:', data.message);
            // Optionally, show an error message to the user
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Optionally, show an error message to the user
    });
}


document.getElementById('saveDateChanges').addEventListener('click', () => {
    const dateId = document.getElementById('editDateId').value;
    const editedDate = document.getElementById('editDateInput').value.trim();
    const editedDetail = document.getElementById('editDetailSelect').value;

    // Basic validation
    if (!editedDate || !editedDetail) {
        alert('Please fill in all the fields.');
        return;
    }

    updateDate(dateId, editedDate, editedDetail);
});

function showAlert(message, type = 'success') { // Type can be 'success' or 'danger'
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alert = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    alertPlaceholder.innerHTML = alert;
    setTimeout(() => alertPlaceholder.innerHTML = '', 3000); // Hide alert after 3 seconds
}


