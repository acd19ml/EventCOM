document.addEventListener('DOMContentLoaded', () => {
  fetch('./components/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            headerPlaceholder.innerHTML = data;
        });
  fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('footer-placeholder');
            headerPlaceholder.innerHTML = data;
        });
  fetch('http://localhost:8000/api/posts/',{
        method: "GET",
          })
      .then(response => response.json())
      .then(data => {
          const posts = data.data;
          posts.forEach((post, index) => {
            const statusMap = {
                "interested": "interestedAccordion",
                "in progress": "inProgressAccordion",
                "completed": "completedAccordion",
            };
            const todosArray = Array.isArray(post.todos) ? post.todos : [];
            const todosHTML = post.todos.map((todo, index) => {
                return `
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "title_proposed" id="todo-title-proposed-${index}" ${todo.title_proposed ? 'checked' : ''}>
                        <label for="todo-title-proposed-${index}">Title Proposed</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "contact_speaker" id="todo-contact-speaker-${index}" ${todo.contact_speaker ? 'checked' : ''}>
                        <label for="todo-contact-speaker-${index}">Contact Speaker</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "time_confirmed" id="todo-time-confirmed-${index}" ${todo.time_confirmed ? 'checked' : ''}>
                        <label for="todo-time-confirmed-${index}">Time Confirmed</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "venue_booked" id="todo-venue-booked-${index}" ${todo.venue_booked ? 'checked' : ''}>
                        <label for="todo-venue-booked-${index}">Book Venue</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "web_updated" id="todo-web-updated-${index}" ${todo.web_updated ? 'checked' : ''}>
                        <label for="todo-web-updated-${index}">Update COM Opportunities Hub/ Founders Club</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "calender_invite" id="todo-calender-invite-${index}" ${todo.calender_invite ? 'checked' : ''}>
                        <label for="todo-calender-invite-${index}">Calendar Invite</label>
                    </div>
                `;
            }).join('');
            
            const containerId = statusMap[post.status.toLowerCase()] || "interestedAccordion"; // 默认为interested状态
            const postsContainer = document.getElementById(containerId);
        
            const postItem = `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                            ${post.title}
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#${containerId}">
                        <div class="accordion-body">
                              <div class="todos-container">
                                ${todosHTML}
                              </div>
                              <strong>Email:</strong> ${post.email}<br>
                              <strong>Name:</strong> ${post.name}<br>
                              <strong>Role:</strong> ${post.role}<br>
                              <strong>Organisation:</strong> ${post.organisation}<br>
                              <strong>KindofTalks: ${post.kind_of_talk}<br>
                              <strong>Title:</strong> ${post.title}<br>
                              <strong>Description:</strong> ${post.description}<br>
                              <strong>Dates:</strong> ${post.dates}<br>
                              <strong>ExtraDetails:</strong> ${post.extra_details}<br>
                              <strong>Contact:</strong> ${post.contact}<br>
                              <strong>Location:</strong> ${post.location}<br>
                              <strong>Status:</strong> ${post.status}<br>
                              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button class="btn btn-danger delete-btn" data-id="${post.id}">Delete</button>
                                <div class="button-container">
                                    ${post.status.toLowerCase() === 'interested' ? `<button class="btn btn-primary progress-btn" data-id="${post.id}">In Progress</button>` : ''}
                                    ${post.status.toLowerCase() === 'in progress' ? `
                                    <button class="btn btn-success complete-btn" data-id="${post.id}">Completed</button>
                                    <button class="btn btn-secondary interested-btn" data-id="${post.id}">Interested</button>
                                        ` : ''}
                                </div>
                                ${post.status.toLowerCase() === 'completed' ? `<button class="btn btn-primary progress-btn" data-id="${post.id}">Give another talk</button>` : ''}
                              
                              </div>
                          </div>
                      </div>
                  </div>
              `;
              postsContainer.innerHTML += postItem;
          });
      })
      .catch(error => console.error('Error fetching posts:', error));
});


document.body.addEventListener('click', function(e) {
    const postId = e.target.getAttribute('data-id');
    if (e.target.classList.contains('delete-btn')) {
        deletePost(postId);
    } else if (e.target.classList.contains('progress-btn')) {
        updatePostStatus(postId, 'in progress');
    } else if (e.target.classList.contains('complete-btn')) {
        // Show confirmation dialog for "Completed" button
        const isConfirmed = confirm("Are you sure you want to mark this event as completed?");
        if (isConfirmed) {
            updatePostStatus(postId, 'completed');
        }
    } else if (e.target.classList.contains('interested-btn')) {
        updatePostStatus(postId, 'interested');
    } else if (e.target.classList.contains('new-talk-btn')) {
        createNewTalkBasedOnPost(postId);
    }
});

document.body.addEventListener('change', function(e) {
    if (e.target.classList.contains('todo-checkbox')) {
        const postId = e.target.getAttribute('data-postid');
        const field = e.target.getAttribute('data-field');
        const isChecked = e.target.checked;
        const updateData = { [field]: isChecked };

        // 发送请求更新todo项
        fetch(`http://localhost:8000/api/posts/${postId}/todos`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        })
        .then(response => response.json())
        .then(data => console.log('Todo updated:', data))
        .catch(error => console.error('Error updating todo:', error));
    }
});


function moveToCorrectSection(postElement, newStatus) {
    const targetContainerId = {
        'interested': 'interestedAccordion',
        'in progress': 'inProgressAccordion',
        'completed': 'completedAccordion',
    }[newStatus.toLowerCase()];

    const targetContainer = document.getElementById(targetContainerId);
    if (targetContainer) {
        targetContainer.appendChild(postElement);
    }

    // Update the buttons based on the new status
    const buttonContainer = postElement.querySelector('.button-container');
    if (buttonContainer) {
        const buttonsHtml = {
            'interested': `<button class="btn btn-primary progress-btn" data-id="${postElement.dataset.id}">In Progress</button>`,
            'in progress': `
                <button class="btn btn-success complete-btn" data-id="${postElement.dataset.id}">Completed</button>
                <button class="btn btn-secondary interested-btn" data-id="${postElement.dataset.id}">Interested</button>
            `,
            'completed': ``
        }[newStatus.toLowerCase()];

        buttonContainer.innerHTML = buttonsHtml;
    }

    // Update the status text
    const statusElement = postElement.querySelector('.post-status');
    if (statusElement) {
        statusElement.textContent = `Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
    }
}
function updatePostStatus(postId, newStatus) {
    fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(`Post status updated to ${newStatus}:`, data);

        const postElement = document.querySelector(`button[data-id="${postId}"]`).closest('.accordion-item');
        if (postElement) {
            moveToCorrectSection(postElement, newStatus);
        }
    })
    .catch(error => console.error(`Error updating post status:`, error));
}




function deletePost(postId) {
    const isConfirmed = confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) {
        return; // If the user cancels, it returns directly without deleting the operation.
    }

    fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'DELETE',
    })
    .then(response => {
        // Check if the status code is 204 No Content
        if (response.status === 204) {
            console.log('Post deleted successfully');
            removePostFromDOM(postId); // Remove post from DOM after successful deletion
            return null; // Since no content is returned, null or an empty object is returned here.
        } else {
            return response.json(); // If the response is not 204, try parsing as JSON
        }
    })
    .catch(error => console.error('Error deleting post:', error));
}


function removePostFromDOM(postId) {
    // Finds the corresponding post element based on the postId and removes it.
    const postElement = document.querySelector(`button[data-id="${postId}"]`).closest('.accordion-item');
    if (postElement) {
        postElement.remove();
    } else {
        console.error('Post element not found');
    }
}

function createNewTalkBasedOnPost(postId) {
    fetch(`http://localhost:8000/api/posts/${postId}`)
    .then(response => response.json())
    .then(data => {
        const post = data.data;
        post.title += " - new"; // Append "- new" to the title
        post.status = "interested"; // Set status to "interested"

        // Remove ID from the post to ensure a new post is created
        delete post.id;

        return fetch('http://localhost:8000/api/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('New talk based on post created:', data);
        // Add logic to handle DOM updates as necessary
    })
    .catch(error => console.error('Error creating new talk based on post:', error));
}


