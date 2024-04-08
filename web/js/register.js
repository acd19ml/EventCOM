document.addEventListener("DOMContentLoaded", function() {
    console.log('The DOM is fully loaded.');
    const form = document.getElementById("signupForm");
    console.log(form);
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            passwordConfirm: document.getElementById("passwordConfirm").value,
        };

        fetch("http://localhost:8000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log("Registration successful", data);
            localStorage.setItem('emailForVerification', formData.email);
            window.location.href = "/verifyemail.html"; 
        })
        .catch(error => {
 
            console.error("Error during registration:", error);
        });
    });
});
