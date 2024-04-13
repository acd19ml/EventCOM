document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('resetToken');

    // Debugging: Log the resetToken to see what is captured
    console.log('Reset token from URL:', resetToken);

    document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        if (!resetToken) {
            alert('Reset token is missing in the URL.');
            return; // Exit the function if no reset token
        }

        fetch(`http://localhost:8000/api/auth/resetpassword/${resetToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password,
                passwordConfirm: passwordConfirm
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Your password has been reset successfully!');
                window.location.href = '/login.html';
            } else {
                alert('Failed to reset password: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to reset password: ' + error.message);
        });
    });
});
