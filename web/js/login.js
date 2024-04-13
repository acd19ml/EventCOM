document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {

                console.log('Login success');
                alert('You successfully logged in');
                window.location.href = '/'; 
            } else {

                alert(data.message || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error during login');
        });
    });
});
