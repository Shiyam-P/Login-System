# Local Login System

A simple local login system demonstrating **login validation**, **JSON handling**, and **email notification** — no database required.

---

##  Project Structure

```
login-system/
├── server.js          ← Express backend (API + static server)
├── users.json         ← Predefined user store (no database)
├── package.json       ← Node.js dependencies
├── public/
│   └── index.html     ← Login frontend
└── README.md
```

---

##  Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure email (for login notifications)

Open `server.js` and find the `EMAIL_CONFIG` section near the top:

```js
const EMAIL_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your_email@gmail.com",       // ← Your Gmail address
    pass: "your_app_password_here",     // ← Gmail App Password
  },
};
const FROM_EMAIL = "your_email@gmail.com";
```

**To get a Gmail App Password:**
1. Go to your Google Account → Security
2. Enable 2-Step Verification (required)
3. Search for "App Passwords"
4. Create a new app password → copy the 16-character code
5. Paste it as the `pass` value above

> **Note:** If email is not configured, the login still works — you'll just see a warning in the server console.

### 3. Start the server
```bash
npm start
```

### 4. Open the app
Visit **http://localhost:3000** in your browser.

---

##  Test Accounts

| Email                       | Password  |
|-----------------------------|-----------|
| vstteddy@gmail.com          | alice123  |
| santhoshravi7503@gmail.com  | bob456    |
| usuriya0809@gmail.com       | carol789  |

---

##  How It Works

```
1. User submits email + password via the login form
2. Frontend sends POST /login with JSON body:
   { "email": "vstteddy220910@gmail.com", "password": "admin123" }

3. Backend reads users.json and checks credentials:
    Match  → returns success JSON + sends email notification
    No match → returns error JSON

4. Frontend displays the result + shows raw JSON response
```

### Success Response
```json
{
  "success": true,
  "message": "Welcome back, Alice Johnson! A login notification has been sent to your email.",
  "user": {
    "id": 1,
    "name": "Shiyam",
    "email": "vstteddy220910@gmail.com"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid email or password. Please try again."
}
```

---

## ➕ Adding Users

Edit `users.json` and add a new entry:

```json
{
  "id": 4,
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}
```

Restart the server — no code changes needed.

---

##  Security Notice

This is a **demo project** only. For production:
- Hash passwords with **bcrypt** (never store plaintext)
- Use **HTTPS** and environment variables for secrets
- Add **rate limiting** to prevent brute-force attacks
- Implement **JWT or sessions** for auth state
- Validate and sanitize all inputs
