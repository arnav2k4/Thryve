document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('employeeForm');
    const messageEl = document.getElementById('message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Convert and validate number fields
        const numericFields = [
            'empExperience', 'empTenure', 'empSalary',
            'empJobSatis', 'empAvgWeekHrs',
            'empYrsSinceLastPromo', 'empBurn', 'empFeedback'
        ];
        
        numericFields.forEach(field => {
            data[field] = Number(data[field]);
            if (isNaN(data[field])) {
                throw new Error(`Invalid number value for ${field}`);
            }
        });
        messageEl.textContent = '';
        messageEl.style.display = 'none';

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (response.ok) {
                messageEl.textContent = result.message;
                messageEl.style.color = 'green';
                form.reset();
                // Redirect to success page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/success.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'Server error');
            }
        } catch (error) {
            messageEl.textContent = error.message || 'Error saving data. Please try again.';
            messageEl.style.color = 'red';
            console.error('Error:', error);
        }
        
        messageEl.style.display = 'block';
    });
});