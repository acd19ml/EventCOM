document.addEventListener('DOMContentLoaded', function() {
    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('footer-placeholder');
            headerPlaceholder.innerHTML = data;
        });

    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('postId');
    if (postId) {
        formSubject(postId)
        formContent(postId)
        checkStatus(postId)
        checkInterest(postId)

    }

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

    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('postId');
    
    // 构建注册链接
    const url = `http://localhost:3000/attendance.html?postId=${postId}`;

    const emailData = {
        subject: subject,
        content: content,
        recipients: recipients,
        url: url
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
            return response.json(); 
        } else if (response.status === 401) {
            alert('Your session has expired Please click here to log in again.');
            window.location.href = '/login.html';        
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
            return response.json();  
        } else if (response.status === 401) {
            alert('Your session has expired Please click here to log in again.');
            window.location.href = '/login.html';        
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
        const matchesStatus = statuses.length === 0 || statuses.includes(attendee.status) || attendee.status === '';
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

function formSubject(postId) {
    fetch(`http://localhost:8000/api/posts/${postId}`)
        .then(response => response.json())
        .then(response => {
            const data = response.data;
            const subject = `${data.title} - ${data.dates.join(', ')}, ${data.location}`;
            document.getElementById('emailSubject').value = subject;
            console.log("Email subject set as:", subject);  // For debugging
        })
        .catch(error => {
            console.error('Error fetching post for subject:', error);
        });
}

function formContent(postId) {
    fetch(`http://localhost:8000/api/posts/${postId}`)
        .then(response => response.json())
        .then(response => {
            const data = response.data;
            const content = 
`Hello everyone,

${data.description}

Looking forward to seeing you there.

Best wishes,
Andy Stratton`;
            document.getElementById('emailContent').innerHTML = content; 
            console.log("Email content set as:", content); 
        })
        .catch(error => {
            console.error('Error fetching post for content:', error);
        });
}



function checkInterest(postId) {
    fetch(`http://localhost:8000/api/posts/${postId}`)
        .then(response => response.json())
        .then(response => {
            const data = response.data;
            const interestSelect = document.getElementById('interestSelect');
            console.log('Checking interest for:', data.kind_of_talk);
            // Reset the selection first
            interestSelect.value = '';

            // Process each item in the array
            data.kind_of_talk.forEach(item => {
                item.split(',').map(type => type.trim()).forEach(type => {
                    if (type === "Talk from Industry") {
                        interestSelect.value = document.getElementById('industryTalk').value;
                    } else if (type === "COM Founder's Club Talk") {
                        interestSelect.value = document.getElementById('foundersTalk').value;
                    }
                });
            });

            console.log("Interest set based on kind of talk:", interestSelect.value);
        })
        .catch(error => {
            console.error('Error fetching post details for interests:', error);
        });
}


function checkStatus(postId) {
    fetch(`http://localhost:8000/api/posts/${postId}`)
        .then(response => response.json())
        .then(response => {
            const data = response.data; 
            console.log('Checking status for:', data.kind_of_talk);

            // Process each item in the array
            data.kind_of_talk.forEach(item => {
                item.split(',').map(type => type.trim()).forEach(type => {
                    if (type === "Talk to 1st year students") {
                        document.getElementById('1stYear').checked = true;
                    }
                    if (type === "Talk to 2nd year students") {
                        document.getElementById('2ndYear').checked = true;
                    }
                    if (type === "Talk to 3rd year students") {
                        document.getElementById('3rdYear').checked = true;
                    }
                    if (type === "Talk to MSc students") {
                        document.getElementById('MSc').checked = true;
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
}

