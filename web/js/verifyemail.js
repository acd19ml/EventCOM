document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("verificationForm");

    const verificationCodeInput = document.getElementById("verificationCode");

    // Parsing the URL query parameters to get the CAPTCHA
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // If the URL contains a CAPTCHA, it is automatically populated in the input box
    if (code) {
        verificationCodeInput.value = code;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const verificationCodeInput = document.getElementById("verificationCode");
        const userCode = verificationCodeInput.value;

        const apiUrl = `http://localhost:8000/api/auth/verifyemail/${userCode}`;

        fetch(apiUrl, {
            method: "GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Verification failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                alert("Email verified successfully. Please log in.");
                window.location.href = "/login.html"; 
            } else {
                messageDiv.textContent = "Verification failed: " + data.message; 
            }
        })
        .catch(error => {
            console.error('Error during email verification:', error);
            messageDiv.textContent = "Error: " + error.message; 
        });
    });
});



