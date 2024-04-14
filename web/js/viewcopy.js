// postDetails.js
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');

    if (postId) {
        fetch(`http://localhost:8000/api/posts/${postId}`, {
            credentials: 'include' // 如果 API 需要身份验证
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch post details');
            return response.json();
        })
        .then(data  => {
            if (data.status === "success" && data.data) {
                const post = data.data;
                const postDiv = document.getElementById('postContent');
                postDiv.innerHTML = `
                    <div class="container">
                        <div class="row mb-2"><div class="col-sm-4"><strong>Email:</strong></div><div class="col-sm-8">${post.email}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Name:</strong></div><div class="col-sm-8">${post.name}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Role:</strong></div><div class="col-sm-8">${post.role}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Organisation:</strong></div><div class="col-sm-8">${post.organisation}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Contact:</strong></div><div class="col-sm-8">${post.contact}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Kinds of Talk:</strong></div><div class="col-sm-8">${post.kind_of_talk}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Title:</strong></div><div class="col-sm-8">${post.title}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Description:</strong></div><div class="col-sm-8">${post.description}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Possible Dates:</strong></div><div class="col-sm-8">${post.dates}</div></div>
                        <div class="row mb-2"><div class="col-sm-4"><strong>Extra Details:</strong></div><div class="col-sm-8">${post.extra_details}</div></div>
                    </div>
                `;

            } else {
                console.error('Unexpected data structure:', data);
                alert('Failed to load post details correctly.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching post details.');
        });
    } else {
        alert('Invalid post ID provided.');
        window.location.href = './response.html'; // Redirect if postId is not found
    }
});
