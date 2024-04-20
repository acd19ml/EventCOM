document.getElementById('attendanceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const queryParams = new URLSearchParams(window.location.search);
    console.log('Testing Post ID:', queryParams.get('postId'));
    const postId = queryParams.get('postId');

    console.log('Post ID:', postId);

    const formData = {
        email: email,
        postId: postId,
    };

    console.log('Form Data:', formData);
    
    fetch('http://localhost:8000/api/attendances/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Registration successful!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form');
    });
});