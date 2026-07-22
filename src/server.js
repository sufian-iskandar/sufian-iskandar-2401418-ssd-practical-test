import express from 'express';

const app = express();
const PORT = 8080;

// ==========================================
// DELIBERATE SECURITY FLAW FOR SONARQUBE (Q8)
// ==========================================
// SonarQube will flag this hardcoded plaintext secret/credential during SAST scanning.
const dbConnectionString = "mysql://admin:SuperSecretHardcodedPassword123!@localhost:3306/production_db";

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// 1. Home Route: Serves the password submission form
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>SSD Practical Test - Password Validator</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 50px;">
            <h2>Secure Software Development - Password Verification</h2>
            <form action="/submit" method="POST">
                <label for="password">Enter Password:</label><br><br>
                <input type="password" id="password" name="password" style="width: 300px; padding: 8px;" required><br><br>
                <button type="submit" style="padding: 10px 20px;">Submit</button>
            </form>
            <p style="font-size: 12px; color: gray;">
                Requirements: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).
            </p>
        </body>
        </html>
    `);
});

// 2. Submit Route: Validates the password based on exam criteria
app.post('/submit', (req, res) => {
    const password = req.body.password;

    // Regex matching Version 2 password criteria:
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        // (e) If password fails requirements, remain/redirect at the home page
        return res.send(`
            <script>
                alert('Password does not meet the security requirements!');
                window.location.href = '/';
            </script>
        `);
    }

    // (f) If password passes, go to a Welcome page displaying the password and a logout button
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Welcome</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 50px;">
            <h2 style="color: green;">Authentication Successful!</h2>
            <p><strong>Your Submitted Password:</strong> ${password}</p>
            <br>
            <a href="/">
                <button style="padding: 10px 20px; background-color: #f44336; color: white; border: none; cursor: pointer;">Logout</button>
            </a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Web app running on http://localhost:${PORT}`);
});