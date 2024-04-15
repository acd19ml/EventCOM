document.addEventListener('DOMContentLoaded', function() {
    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('footer-placeholder');
            headerPlaceholder.innerHTML = data;
        });

    // const queryParams = new URLSearchParams(window.location.search);
    // const postId = queryParams.get('postId');
    // if (postId) {
    //     formSubject(postId)
    //     formContent(postId)
    
    // }
    // Setup event listeners after the DOM has fully loaded
    setupEventListeners()
    
});


function setupEventListeners() {
    document.getElementById('emailForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('interestSelect').addEventListener('change', filterRecipients);

    // Bind event listeners to role and status checkboxes
    document.querySelectorAll('.role-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterRecipients);
    });
    document.querySelectorAll('.status-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', filterRecipients);
    });

    document.getElementById('addRecipientButton').addEventListener('click', addRecipient);
}
function handleFormSubmit(event) {
    event.preventDefault();
    submitEmailForm();
    console.log("Form Submitted");
}
function submitEmailForm() {
    const subject = document.getElementById('emailSubject').value;
    const content = document.getElementById('emailContent').value;
    const recipients = document.getElementById('emailRecipients').value.split(';').map(email => email.trim());

    const emailData = {
        subject: subject,
        content: content,
        recipients: recipients
    };

    console.log('Submitting:', emailData);

    fetch('http://localhost:8000/api/posts/send-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // 处理成功的响应
        } else if (response.status === 401) {
            alert('Your session has expired Please click here to log in again.');
            window.location.href = '/login.html';  // 未登录，重定向到登录页面            
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        if (data.message) {
            alert('Email sent successfully');
        } else {
            throw new Error('Failed to send email');
        }
    })
    .catch(error => {
        console.error('Error sending email:', error);
        alert('Error sending email: ' + error.message);
    });
}



function filterRecipients() {
    const interest = document.getElementById('interestSelect').value;
    const roles = Array.from(document.querySelectorAll('.role-checkbox:checked')).map(cb => cb.value);
    const statuses = Array.from(document.querySelectorAll('.status-checkbox:checked')).map(cb => cb.value);

    console.log('Filtering Recipients:', {interest, roles, statuses});

    fetch(`http://localhost:8000/api/attendees/`, {
        method: "GET",
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // 处理成功的响应
        } else if (response.status === 401) {
            alert('Your session has expired Please click here to log in again.');
            window.location.href = '/login.html';  // 未登录，重定向到登录页面            
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        if (data.status === "success") {
            console.log('Loaded attendees:', data.data);
            updateRecipientOptions(data.data, interest, roles, statuses);
        } else {
            console.error('Failed to load recipients');
        }
    })
    .catch(error => console.error('Error fetching attendees:', error));
}

function updateRecipientOptions(attendees, interest, roles, statuses) {
    const recipientsInput = document.getElementById('emailRecipients');
    recipientsInput.value = ''; // Clear the input field

    const filteredAttendees = attendees.filter(attendee => {
        const matchesInterest = attendee.interests.includes(interest);
        const matchesRole = roles.length === 0 || roles.includes(attendee.role);
        const matchesStatus = statuses.length === 0 || statuses.includes(attendee.status);
        return matchesInterest && matchesRole && matchesStatus;
    });
    const emailList = filteredAttendees.map(attendee => attendee.email).join('; ');
    console.log('Filtered Emails:', emailList);
    recipientsInput.value = emailList;
}


function addRecipient() {
    const manualEmail = document.getElementById('manualEmail').value;
    const recipientsInput = document.getElementById('emailRecipients');
    if (manualEmail) {
        recipientsInput.value = recipientsInput.value ? recipientsInput.value + '; ' + manualEmail : manualEmail;
        console.log('Added manual email:', manualEmail);
    }
    document.getElementById('manualEmail').value = ''; // Clear the manual entry field
}
