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
        credentials: 'include'
          })
      .then(response => {
            if (response.ok) {
                return response.json();  // 处理成功的响应
            } else if (response.status === 401) {
                alert('Your session has expired Please click here to log in again.');
                window.location.href = '/login.html';  // 未登录，重定向到登录页面            
            } else {
                throw new Error('Something went wrong');
            }
        })
      .then(data => {
          const posts = data.data;
          posts.forEach((post, index) => {
            const statusMap = {
                "interested": "interestedAccordion",
                "in progress": "inProgressAccordion",
                "completed": "completedAccordion",
            };
            const isInProgress = post.status.toLowerCase() === 'in progress';

            const todosHTML =  isInProgress ?
                 `
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "title_proposed" id="todo-title-proposed-${index}" ${post.todos.title_proposed ? 'checked' : ''}>
                        <label for="todo-title-proposed-${index}">Title Proposed</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "contact_speaker" id="todo-contact-speaker-${index}" ${post.todos.contact_speaker ? 'checked' : ''}>
                        <label for="todo-contact-speaker-${index}">Contact Speaker</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "time_confirmed" id="todo-time-confirmed-${index}" ${post.todos.time_confirmed ? 'checked' : ''}>
                        <label for="todo-time-confirmed-${index}">Time Confirmed</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "venue_booked" id="todo-venue-booked-${index}" ${post.todos.venue_booked ? 'checked' : ''}>
                        <label for="todo-venue-booked-${index}">Book Venue</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "web_updated" id="todo-web-updated-${index}" ${post.todos.web_updated ? 'checked' : ''}>
                        <label for="todo-web-updated-${index}">Update COM Opportunities Hub/ Founders Club</label>
                    </div>
                    <div class="todo-item">
                        <input type="checkbox" class="todo-checkbox" data-postid="${post.id}" data-field= "calender_invite" id="todo-calender-invite-${index}" ${post.todos.calender_invite ? 'checked' : ''}>
                        <label for="todo-calender-invite-${index}">Calendar Invite</label>
                    </div>
                `: '';

            
            const containerId = statusMap[post.status.toLowerCase()] || "interestedAccordion"; // 默认为interested状态
            const postsContainer = document.getElementById(containerId);
            const link = `http://localhost:3000/form.html?postId=${post.id}`;
            console.log(post.id)
            const postItem = `
                <div id="post-${post.id}" class="post-item accordion-item">
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
                            <div class="row">
                                <strong class="col-md-2">Email:</strong>
                                <span class="col-md-10 post-email">${post.email}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Name:</strong>
                                <span class="col-md-10 post-name">${post.name}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Role:</strong>
                                <span class="col-md-10 post-role">${post.role}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Organisation:</strong>
                                <span class="col-md-10 post-organisation">${post.organisation}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Kind of Talks:</strong>
                                <span class="col-md-10 post-kind-of-talk">${post.kind_of_talk}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Title:</strong>
                                <span class="col-md-10 post-title">${post.title}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Description:</strong>
                                <span class="col-md-10 post-description">${post.description}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Dates:</strong>
                                <span class="col-md-10 post-dates">${post.dates}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Extra Details:</strong>
                                <span class="col-md-10 post-extra-details">${post.extra_details}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Contact:</strong>
                                <span class="col-md-10 post-contact">${post.contact}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Location:</strong>
                                <span class="col-md-10 post-location">${post.location}</span>
                            </div>
                            <div class="row">
                                <strong class="col-md-2">Status:</strong>
                                <span class="col-md-10 post-status">${post.status}</span>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button class="btn btn-primary copy-link-btn" data-link="${link}">Copy Link</button>
                                <button class="btn btn-danger delete-btn" data-id="${post.id}">Delete</button>
                                <button class="btn btn-secondary edit-btn" data-id="${post.id}">Edit</button>
                                <div class="button-container">
                                    ${post.status.toLowerCase() === 'interested' ? `<button class="btn btn-primary progress-btn" data-id="${post.id}">Agreed</button>` : ''}
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
        window.location.reload();
    } else if (e.target.classList.contains('complete-btn')) {
        // Show confirmation dialog for "Completed" button
        const isConfirmed = confirm("Are you sure you want to mark this event as completed?");
        if (isConfirmed) {
            updatePostStatus(postId, 'completed');
            window.location.reload();
        }
    } else if (e.target.classList.contains('interested-btn')) {
        updatePostStatus(postId, 'interested');
    } else if (e.target.classList.contains('new-talk-btn')) {
        createNewTalkBasedOnPost(postId);
    } else if (e.target.classList.contains('edit-btn')) {
        // Just set the post ID or other necessary data attributes
        const postId = e.target.getAttribute('data-id');
        const modal = document.getElementById('editPostModal');
        modal.setAttribute('data-post-id', postId);  // Store postId in the modal for later use
        fetchPostData(postId);
        var myModal = new bootstrap.Modal(modal);
        myModal.show();
    } else if (e.target.classList.contains('btn-pre-fill')) { 
        var myModal = new bootstrap.Modal(document.getElementById('prefillFormModal'));
        myModal.show();
    } else if (e.target.classList.contains('copy-link-btn')) {
        const link = e.target.getAttribute('data-link');
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard: ' + link);
        }).catch(err => {
            console.error('Error in copying text: ', err);
        });
    } else if (e.target.id === 'logoutButton') {
        console.log('Logout button clicked');
        fetch('http://localhost:8000/api/auth/logout', {
            method: 'GET', // GET method to call the logout endpoint
            credentials: 'include' // Include cookies in the request
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong with the logout process.');
        })
        .then(data => {
            console.log(data); // Handling the received data
            window.location.href = '../index.html'; // Redirect to the home page after logout
        })
        .catch(error => console.error('Error:', error));
    }
});

document.body.addEventListener('change', function(e) {
    if (e.target.classList.contains('todo-checkbox')) {
        const postId = e.target.dataset.postid; // 获取 postId
        // 构造所有复选框的当前状态
        const updateData = {
            title_proposed: document.querySelector(`input[data-postid="${postId}"][data-field="title_proposed"]`).checked,
            contact_speaker: document.querySelector(`input[data-postid="${postId}"][data-field="contact_speaker"]`).checked,
            time_confirmed: document.querySelector(`input[data-postid="${postId}"][data-field="time_confirmed"]`).checked,
            venue_booked: document.querySelector(`input[data-postid="${postId}"][data-field="venue_booked"]`).checked,
            web_updated: document.querySelector(`input[data-postid="${postId}"][data-field="web_updated"]`).checked,
            calender_invite: document.querySelector(`input[data-postid="${postId}"][data-field="calender_invite"]`).checked
        };

        // 发送 PATCH 请求更新所有复选框的状态
        fetch(`http://localhost:8000/api/posts/${postId}/todos`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log('Todos updated:', data))
        .catch(error => console.error('Error updating todos:', error));
    }
});


document.getElementById('editPostForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    const postId = this.closest('.modal').getAttribute('data-post-id');
    
    const updatedData = {
        email: document.getElementById('postEmail').value,
        name: document.getElementById('postName').value,
        role: document.getElementById('postRole').value,
        organisation: document.getElementById('postOrganisation').value,
        kind_of_talk: [document.getElementById('postKindOfTalk').value],
        title: document.getElementById('postTitle').value,
        description: document.getElementById('postDescription').value,
        dates: [document.getElementById('postDates').value],
        extra_details: document.getElementById('postExtraDetails').value,
        contact: document.getElementById('postContact').value,
        location: document.getElementById('postLocation').value
    };

    fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'fail') {
            throw new Error(data.message);
        }
        console.log('Post updated successfully', data);
        updateDOMPost(postId, updatedData); // Update the DOM directly
        bootstrap.Modal.getInstance(document.getElementById('editPostModal')).hide();
    })
    .catch(error => {
        console.error('Error updating post:', error);
        alert(error.message);
    });
});

document.getElementById('prefillForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = {
        email: document.getElementById('prefillEmail').value,
        name: document.getElementById('prefillName').value,
        role: document.getElementById('prefillRole').value,
        organisation: document.getElementById('prefillOrganisation').value
    };

    fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        bootstrap.Modal.getInstance(document.getElementById('prefillFormModal')).hide();
        window.location.reload();  // Reload the page
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function updateDOMPost(postId, data) {
    const postElement = document.getElementById(`post-${postId}`);
    if (postElement) {
        postElement.querySelector('.post-email').textContent = data.email || '';
        postElement.querySelector('.post-name').textContent = data.name || '';
        postElement.querySelector('.post-role').textContent = data.role || '';
        postElement.querySelector('.post-organisation').textContent = data.organisation || '';
        postElement.querySelector('.post-kind-of-talk').textContent = Array.isArray(data.kind_of_talk) ? data.kind_of_talk.join(", ") : data.kind_of_talk;
        postElement.querySelector('.post-title').textContent = data.title || '';
        postElement.querySelector('.post-description').textContent = data.description || '';
        postElement.querySelector('.post-dates').textContent = Array.isArray(data.dates) ? data.dates.join(", ") : data.dates;
        postElement.querySelector('.post-extra-details').textContent = data.extra_details || '';
        postElement.querySelector('.post-contact').textContent = data.contact || '';
        postElement.querySelector('.post-location').textContent = data.location || '';
        postElement.querySelector('.post-status').textContent = data.status || '';
    } else {
        console.error('Post element not found for update:', postId);
    }
}



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

// Function to load talks from the server and populate the table
function loadTalks() {
    fetch('http://localhost:8000/api/talks/')
      .then(response => response.json())
      .then(result => {
        if (result.status === "success" && Array.isArray(result.data)) {
          const talksTableBody = document.getElementById('talksTableBody');
          talksTableBody.innerHTML = ''; // Clear existing entries
          result.data.forEach((talk, index) => {
            const row = `
              <tr>
                <td><input type="text" class="form-control" value="${talk.talk}" id="talkType${talk.id}"></td>
                <td><input type="text" class="form-control" value="${talk.detail}" id="talkDetail${talk.id}"></td>
                <td>
                  <button class="btn btn-success" onclick="updateTalk('${talk.id}')">Save</button>
                  <button class="btn btn-danger" onclick="deleteTalk('${talk.id}')">Delete</button>
                </td>
              </tr>
            `;
            talksTableBody.innerHTML += row;
          });
        } else {
          console.error('No data available or incorrect format:', result);
        }
      })
      .catch(error => console.error('Error fetching talks:', error));
}

  
  document.getElementById('editTalksModal').addEventListener('show.bs.modal', loadTalks);

  function addNewTalk() {
    // Example of how you might want to collect talk type and its detail
    const talkType = prompt("Enter the type of talk:");
    const talkDetail = prompt("Enter detail for the talk:");

    if (talkType && talkDetail) {
        const data = { 
            talk: talkType, 
            detail: talkDetail 
        };

        console.log("Sending data:", data);  // Log the data being sent to check it

        fetch('http://localhost:8000/api/talks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                // If there's an error, convert it to JSON and throw it
                return response.json().then(err => {
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(err)}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            loadTalks(); // Reload talks to show the new entry
        })
        .catch(error => console.error('Error adding new talk:', error));
    } else {
        console.error("Talk type or detail is missing.");
    }
}



function updateTalk(talkId) {
    const talkType = document.getElementById(`talkType${talkId}`).value;
    const talkDetail = document.getElementById(`talkDetail${talkId}`).value;

    const data = { 
        talk: talkType, 
        detail: talkDetail 
    };

    fetch(`http://localhost:8000/api/talks/${talkId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Talk updated successfully:', data);
        loadTalks(); // Optionally reload talks to reflect the changes
    })
    .catch(error => console.error('Error updating talk:', error));
}

function deleteTalk(talkId) {
    const confirmDelete = confirm("Are you sure you want to delete this talk?");
    if (confirmDelete) {
        fetch(`http://localhost:8000/api/talks/${talkId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Check if the response has content
            if (response.status === 204 || response.headers.get("Content-Length") === "0") {
                return null;  // No content to process
            } else {
                return response.json();  // Process JSON if available
            }
        })
        .then(data => {
            console.log('Talk deleted successfully', data);
            loadTalks(); // Reload talks to reflect the deletion
        })
        .catch(error => console.error('Error deleting talk:', error));
    }
}

 
var editModal = document.getElementById('editPostModal');

editModal.addEventListener('show.bs.modal', function () {
    // Retrieve the postId stored earlier
    var postId = this.getAttribute('data-post-id');
    console.log("Modal showing for postId:", postId);
    fetchPostData(postId)
        
});

function fetchPostData(postId) {
    fetch(`http://localhost:8000/api/posts/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data fetched successfully:", data);
            // Populate the form fields for editing
            document.getElementById('postEmail').value = data.data.email; 
            document.getElementById('postName').value = data.data.name;
            document.getElementById('postRole').value = data.data.role;
            document.getElementById('postOrganisation').value = data.data.organisation;
            document.getElementById('postKindOfTalk').value = data.data.kind_of_talk;
            document.getElementById('postTitle').value = data.data.title;
            document.getElementById('postDescription').value = data.data.description;
            document.getElementById('postDates').value = data.data.dates;
            document.getElementById('postExtraDetails').value = data.data.extra_details;
            document.getElementById('postContact').value = data.data.contact;
            document.getElementById('postLocation').value = data.data.location;
        })
        .catch(error => {
            console.error('Error loading post details:', error);
            alert('Failed to load the data for editing. Please try again.');
        });
        
}



