document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const status = document.getElementById('status').value; // 获取选中的年份值
    const interests = [];
    if (document.getElementById('industryTalk').checked) {
        interests.push("Talk from Industry");
    }
    if (document.getElementById('foundersTalk').checked) {
        interests.push("COM Founder's Club Talk");
    }

    const formData = {
        email: email,
        role: role,
        status: status,
        interests: interests
    };

    fetch('http://localhost:8000/api/attendees/', {
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
