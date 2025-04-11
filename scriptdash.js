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
            // Store the employee ID for the success page
            localStorage.setItem('lastSubmittedEmpId', empID);
            
            // Redirect with the employee ID in the URL
            window.location.href = `success.html?empId=${empID}`;
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

// Modify the nextPage() function's success handler
