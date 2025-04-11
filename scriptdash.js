function fetchUserData() {
    fetch('http://localhost:3000/users') // Adjust the endpoint as necessary
        .then(response => response.json())
        .then(data => {
    const usernameInput = document.getElementById('username');
    usernameInput.value = data.username; // Set the username input field with the logged-in user's username
    const userInfoDiv = document.getElementById('employee-info');
    userInfoDiv.innerHTML = `<h2>User Information</h2>
                                      <p>Email: ${data.email}</p>`;

        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function nextPage() {
    console.log("Next Clicked")
    const empID = document.getElementById('emp-id').value;
    const empName = document.getElementById('emp-name').value;
    const empRole = document.getElementById('emp-role').value;
    const empDept = document.getElementById('emp-dept').value;
    const empExperience = document.getElementById('emp-experience').value;
    const empTenure = document.getElementById('emp-tenure').value;
    const empSalary = document.getElementById('emp-salary').value;
    const empJobSatis = document.getElementById('emp-job-satis').value;
    const empAvgWeekHrs = document.getElementById('emp-avg-week-hrs').value;
    const empYrsSinceLastPromo = document.getElementById('emp-yrs-since-last-promo').value;
    const empBurn = document.getElementById('emp-burn').value;
    const empFeedback = document.getElementById('emp-feedback').value;

    // Validate required fields
    if (!empID || !empName || !empRole || !empDept || 
        !empExperience || !empTenure || !empSalary || 
        !empJobSatis || !empAvgWeekHrs || !empYrsSinceLastPromo || !empBurn) {
        alert('Please fill out all required fields.');
        return;
    }

    const data = {
        emp_id: empID,
        emp_name: empName,
        emp_role: empRole,
        emp_dept: empDept,
        emp_experience: parseInt(empExperience),
        emp_tenure: parseInt(empTenure),
        emp_salary: parseInt(empSalary),
        emp_job_satis: parseInt(empJobSatis),
        emp_avg_week_hrs: parseInt(empAvgWeekHrs),
        emp_yrs_since_last_promo: parseFloat(empYrsSinceLastPromo),
        emp_burn: parseInt(empBurn),
        emp_feedback: empFeedback ? parseInt(empFeedback) : null
    };

    fetch('http://localhost:3000/employee-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert(result.message);
            window.location.href = 'success.html';
        } else if (result.error) {
            alert(`Error: ${result.error}`);
            console.error('Server error details:', result.details);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data. Please try again.');
    });
}


function loginUser(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            alert('Login successful!');
            console.log('Redirecting to dashboard...');

            // ✅ Store username in Local Storage
            localStorage.setItem("usern", document.getElementById('login-username').value);

            setTimeout(() => {
                window.location.href = 'indexdash.html'; // Redirect after 1 sec
            }, 10);
        } else {
            alert('Error: ' + (data.error || 'Login failed.'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');

    // ✅ Get username from Local Storage
    const ab = localStorage.getItem("usern");

    if (ab) {
        usernameInput.value = ab;
    } else {
        usernameInput.value = 'User not found';
    }
});