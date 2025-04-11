const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'user',
    database: 'techtalent',
    port: 3306
});

// Create employee table if not exists
const createEmployeeTable = `
CREATE TABLE IF NOT EXISTS employee (
    empID VARCHAR(10) PRIMARY KEY,
    empName VARCHAR(50),
    empRole VARCHAR(50),
    empDept VARCHAR(100),
    empExperience INT,
    empTenure INT,
    empSalary BIGINT,
    empJobSatis INT,
    empAvgWeekHrs INT,
    empYrsSinceLastPromo FLOAT,
    empBurn INT,
    empFeedback INT
);`;

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    
    db.query(createEmployeeTable, (err) => {
        if (err) throw err;
        console.log('Employee table ready');
    });
});

// Handle employee data submission
app.post('/employee-data', (req, res) => {
    const { 
        emp_id, emp_name, emp_role, emp_dept, 
        emp_experience, emp_tenure, emp_salary, 
        emp_job_satis, emp_avg_week_hrs, 
        emp_yrs_since_last_promo, emp_burn, emp_feedback 
    } = req.body;

    console.log('Received data:', req.body);

    // Validate required fields
    if (!emp_id || !emp_name || !emp_role || !emp_dept || 
        emp_experience === undefined || emp_tenure === undefined || 
        emp_salary === undefined || emp_job_satis === undefined || 
        emp_avg_week_hrs === undefined || emp_yrs_since_last_promo === undefined || 
        emp_burn === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `INSERT INTO employee (
        empID, empName, empRole, empDept, 
        empExperience, empTenure, empSalary, 
        empJobSatis, empAvgWeekHrs, 
        empYrsSinceLastPromo, empBurn, empFeedback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        emp_id, emp_name, emp_role, emp_dept,
        emp_experience, emp_tenure, emp_salary,
        emp_job_satis, emp_avg_week_hrs,
        emp_yrs_since_last_promo, emp_burn, emp_feedback
    ], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                error: 'Database error',
                details: err.message 
            });
        }
        res.status(201).json({ 
            message: 'Employee data saved successfully',
            insertedId: emp_id
        });
    });
});

// Add these at the top of server.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Add this new endpoint
app.get('/employee-risk/:empId', async (req, res) => {
    try {
        const empId = req.params.empId;
        
        // Execute the Python script with the employee ID
        const { stdout, stderr } = await execPromise(`python "model code.py" ${empId}`);
        
        if (stderr) {
            console.error('Python error:', stderr);
            return res.status(500).json({ error: 'Model execution failed' });
        }

        // Parse the Python output (you may need to adjust this based on your output format)
        const result = {
            riskScore: stdout.match(/Risk Score \(Probability of Failure\): ([\d.]+)%/)?.[1],
            riskFactors: stdout.match(/🚩 Top Risk Factors:\n((?:   - .+\n)+)/)?.[1].split('\n').filter(f => f.trim()),
            suggestions: stdout.match(/✅ Suggestions:\n((?:   ➤ .+\n)+)/)?.[1].split('\n').filter(f => f.trim())
        };

        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Also add this endpoint to get all employees (for the table)
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});