document.addEventListener('DOMContentLoaded', function () {
    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('footer-placeholder');
            headerPlaceholder.innerHTML = data;
        });
    var form = document.getElementById('eventForm');
        document.getElementById('clearForm').addEventListener('click', function() {
            form.reset();
        });
    // Fetch talk options
    fetch('http://localhost:8000/api/talks/')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(response => {
        const talksContainer = document.querySelector('.form-check');
        if (!Array.isArray(response.data)) {
            console.error('Expected an array of talks, received:', response);
            return; // Stop execution if the data is not an array
        }
        response.data.forEach(talk => {
            const talkRow = document.createElement('div');
            talkRow.className = 'row';
            talkRow.innerHTML = `
                <div class="col">
                    <input class="form-check-input" type="checkbox" value="${talk.detail}" id="talk${talk.id}" name="talks">
                    <label class="form-check-label" for="talk${talk.id}">${talk.detail}</label>
                </div>
            `;
            talksContainer.appendChild(talkRow);
        });

        // Append the 'Other' input field after all checkboxes
        const otherTalkRow = document.createElement('div');
        otherTalkRow.className = 'row';
        otherTalkRow.innerHTML = `
            <div class="col">
                <input type="text" class="form-control" id="otherTalk" name="otherTalk" placeholder="Other (Please specify)">
            </div>
        `;
        talksContainer.appendChild(otherTalkRow);
    })
    .catch(error => console.error('Error fetching talk options:', error));

    
    fetch('http://localhost:8000/api/dates/')
    .then(response => response.json())
    .then(responseObj => {
        // Assuming responseObj.data could be an array of date objects
        const dates = Array.isArray(responseObj.data) ? responseObj.data : [responseObj.data]; // Make sure it's an array
        const datesContainer = document.getElementById('datesSelection');
        
        dates.forEach((dateObj, index) => {
            const dateRow = document.createElement('div');
            dateRow.className = 'row mb-3'; // Added mb-3 for margin-bottom
            dateRow.innerHTML = `
                <div class="col-sm-3">
                    <label>${dateObj.date}</label>
                </div>
                <div class="col-sm-9">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="dateOption${index}" id="preferredDate${index}" value="Preferred">
                        <label class="form-check-label" for="preferredDate${index}">Preferred</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="dateOption${index}" id="possibleDate${index}" value="Possible">
                        <label class="form-check-label" for="possibleDate${index}">Possible</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="dateOption${index}" id="notAvailableDate${index}" value="Not Available">
                        <label class="form-check-label" for="notAvailableDate${index}">Not Available</label>
                    </div>
                </div>
            `;
            datesContainer.appendChild(dateRow);
        });
    })
    .catch(error => console.error('Error fetching dates:', error));

    
    var form = document.getElementById('eventForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // 阻止表单的默认提交行为

        // 收集选中的讲座类型和手动输入的讲座类型
        var talksChecked = Array.from(form.querySelectorAll('input[name="talks"]:checked')).map(checkbox => checkbox.value);
        var otherTalkValue = form.querySelector('#otherTalk').value.trim();
        if (otherTalkValue) {
            talksChecked.push(otherTalkValue); // 如果有手动输入的值，添加到数组中
        }

        // Collecting the date selections and their statuses
        var datesStatuses = [];
        document.querySelectorAll('#datesSelection .row').forEach(function(row) {
            const label = row.querySelector('label');
            const dateValue = label ? label.textContent.trim() : 'Unknown Date'; // Default to 'Unknown Date' if label not found
            row.querySelectorAll('.form-check-input:checked').forEach(function(selectedOption) {
                // datesStatuses.push({ date: dateValue, detail: selectedOption.value });
                datesStatuses.push(dateValue + ' - ' + selectedOption.value);
            });
        });


        var formDataObj = {
            email: form.querySelector('#email').value,
            name: form.querySelector('#name').value,
            role: form.querySelector('#role').value,
            organisation: form.querySelector('#organization').value,
            contact: form.querySelector('#contact').value,
            kind_of_talk: talksChecked,
            title: form.querySelector('#talkTitle').value,
            description: form.querySelector('#talkDescription').value,
            dates: datesStatuses,
            extra_details: form.querySelector('#extraInfo').value,
            // Include status if you need to set a default status here or expect it to be set on the backend
        };
        console.log("Sending the following data to the server:");
        console.log(formDataObj);
        console.log(JSON.stringify(formDataObj));
        // 执行POST请求到服务器
        fetch('http://localhost:8000/api/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // 处理成功响应
        })
        .catch((error) => {
            console.error('Error:', error);
            // 处理错误
        });
    });

    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('postId');
    
    if (postId) {
        fetch(`http://localhost:8000/api/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            // Fill the form with the post data
            document.getElementById('email').value = data.email || '';
            document.getElementById('name').value = data.name || '';
            document.getElementById('role').value = data.role || '';
            document.getElementById('organization').value = data.organisation || '';
            document.getElementById('contact').value = data.contact || '';
            document.getElementById('kind_of_talk').value = data.kind_of_talk || '';
            document.getElementById('title').value = data.title || '';
            document.getElementById('description').value = data.description || '';
            document.getElementById('dates').value = data.dates || '';
            document.getElementById('extraInfo').value = data.extra_details || '';

        })
        .catch(error => console.error('Error fetching post details:', error));
    }
    
});


