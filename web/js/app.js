document.getElementById('fetchData').addEventListener('click', function() {
    fetch('http://localhost:8000/api/posts', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 如果后端需要 cookies 或认证 headers
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const posts = data.map(post => `<li>${post.title} - ${post.content}</li>`).join('');
      document.getElementById('dataDisplay').innerHTML = `<ul>${posts}</ul>`;
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  });
  