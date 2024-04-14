document.addEventListener('DOMContentLoaded', function () {
    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('footer-placeholder');
            headerPlaceholder.innerHTML = data;
        });
    }
);

const queryParams = new URLSearchParams(window.location.search);
const postId = queryParams.get('postId');
if (postId) {
    populateForm(postId)
}

document.getElementById('viewCopyBtn').addEventListener('click', function() {
    var postId = getCookie('postId');  // 从cookie中获取postId
    if (postId) {
        window.location.href = `/viewcopy.html?postId=${postId}`;  // 确保你有这个页面设置好
    } else {
        console.error('Post ID not found in cookies.');
    }
});

// 辅助函数来从cookie获取值
function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}