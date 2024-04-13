// forgotPassword.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        fetch('http://localhost:8000/api/auth/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            alert('Your password reset token has been sent to your email. It is valid for 10 minutes.');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred, please try again.');
        });
    });
});
