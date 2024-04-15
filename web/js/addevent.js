document.getElementById('add-event-form').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止表单默认提交行为

    // 收集表单数据
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        dates: document.getElementById('dates').value.split(',').map(date => date.trim()), 
        location: document.getElementById('location').value,
        extra_details: document.getElementById('extra_details').value,
        status: 'in progress' // 默认提交为'in progress'
    };

    // 发送POST请求到API
    fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
        console.log('Event added:', data);

    })
    .catch(error => {
        console.error('Error adding event:', error);

    });
});
