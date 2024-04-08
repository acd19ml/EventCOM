document.addEventListener('DOMContentLoaded', () => {
  fetch('./components/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            headerPlaceholder.innerHTML = data;
        });
  fetch('http://localhost:8000/api/posts',{
        method: "GET",
          })
      .then(response => response.json())
      .then(posts => {
          const postsContainer = document.getElementById('postsAccordion');
          posts.forEach((post, index) => {
              const postItem = `
                  <div class="accordion-item">
                      <h2 class="accordion-header" id="heading${index}">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                              ${post.title}
                          </button>
                      </h2>
                      <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#postsAccordion">
                          <div class="accordion-body">
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
                          </div>
                      </div>
                  </div>
              `;
              postsContainer.innerHTML += postItem;
          });
      })
      .catch(error => console.error('Error fetching posts:', error));
});

  