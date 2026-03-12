const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// re_RHocTY2u_3nG1Dnc1oeYzid5ujJPwvZh4
// ─── Middleware ───
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// ─── Resend Configuration ───
const RESEND_API_KEY = "re_RHocTY2u_3nG1Dnc1oeYzid5ujJPwvZh4";
const FROM_EMAIL = "onboarding@resend.dev";
const TO_EMAIL = "vstteddy220910@gmail.com";

// ─── Load Users ───
function loadUsers() {
  try {
    const data = fs.readFileSync(path.join(__dirname, "users.json"), "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load users.json:", err.message);
    return [];
  }
}

// ─── Send Login Notification Email via Resend ────
async function sendLoginEmail(user) {
  const loginTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Security Alert <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: "New Login to Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1a1a2e; padding: 24px; text-align: center;">
            <h1 style="color: #e94560; margin: 0; font-size: 22px;">Login Notification</h1>
          </div>
          <div style="padding: 28px; background: #ffffff;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
            <p style="color: #555;">We detected a new login to your account. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background: #f5f5f5;">
                <td style="padding: 10px 14px; color: #888; font-size: 13px;">Account</td>
                <td style="padding: 10px 14px; font-weight: bold; color: #333;">${user.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #888; font-size: 13px;">Time</td>
                <td style="padding: 10px 14px; font-weight: bold; color: #333;">${loginTime}</td>
              </tr>
            </table>
            <p style="color: #555; font-size: 14px;">If this was you, no action is needed. If you did not log in, please change your password immediately.</p>
          </div>
          <div style="background: #f9f9f9; padding: 14px; text-align: center; font-size: 12px; color: #aaa;">
            This is an automated security notification. Please do not reply.
          </div>
        </div>
      `,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Resend error: ${result.message || JSON.stringify(result)}`,
    );
  }

  console.log(`Login email sent to ${TO_EMAIL} (id: ${result.id})`);
}

// ─── POST /login ────
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const users = loadUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    console.log(`Failed login attempt for: ${email}`);
    return res.status(401).json({
      success: false,
      message: "Invalid email or password. Please try again.",
    });
  }

  console.log(`Successful login: ${user.name} (${user.email})`);

  try {
    await sendLoginEmail(user);
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! A login notification has been sent to your email.`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (emailErr) {
    console.warn("Login succeeded but email failed:", emailErr.message);
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! (Email notification could not be sent.)`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
});

// ─── Catch-all: serve login page ────
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`Login server running at http://localhost:${PORT}`);
});

























// const express = require("express");
// const nodemailer = require("nodemailer");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// const app = express();
// const PORT = 3000;

// // ─── Middleware ────────────────────────────────────────────────────────────────
// app.use(express.json());
// app.use(cors());
// app.use(express.static(path.join(__dirname, "public")));

// // ─── Email Configuration ───────────────────────────────────────────────────────
// // Replace with your real SMTP credentials before running.
// // For Gmail: enable "App Passwords" in your Google account and paste it below.
// const EMAIL_CONFIG = {
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "vstteddy220910@gmail.com",       // ← Replace with your Gmail address
//     pass: "thunderteddyranger",     // ← Replace with your Gmail App Password
//   },
// };

// const FROM_EMAIL = "vstteddy220910@gmail.com"; // ← Same as above

// // ─── Load Users ────────────────────────────────────────────────────────────────
// function loadUsers() {
//   try {
//     const data = fs.readFileSync(path.join(__dirname, "users.json"), "utf-8");
//     return JSON.parse(data);
//   } catch (err) {
//     console.error("Failed to load users.json:", err.message);
//     return [];
//   }
// }

// // ─── Send Login Notification Email ────────────────────────────────────────────
// async function sendLoginEmail(user) {
//   const transporter = nodemailer.createTransport(EMAIL_CONFIG);

//   const loginTime = new Date().toLocaleString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     timeZoneName: "short",
//   });

//   const mailOptions = {
//     from: `"Security Alert" <${FROM_EMAIL}>`,
//     to: user.email,
//     subject: "New Login to Your Account",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//         <div style="background: #1a1a2e; padding: 24px; text-align: center;">
//           <h1 style="color: #e94560; margin: 0; font-size: 22px;">Login Notification</h1>
//         </div>
//         <div style="padding: 28px; background: #ffffff;">
//           <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
//           <p style="color: #555;">We detected a new login to your account. Here are the details:</p>
//           <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//             <tr style="background: #f5f5f5;">
//               <td style="padding: 10px 14px; color: #888; font-size: 13px;">Account</td>
//               <td style="padding: 10px 14px; font-weight: bold; color: #333;">${user.email}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; color: #888; font-size: 13px;">Time</td>
//               <td style="padding: 10px 14px; font-weight: bold; color: #333;">${loginTime}</td>
//             </tr>
//           </table>
//           <p style="color: #555; font-size: 14px;">If this was you, no action is needed. If you did not log in, please change your password immediately.</p>
//         </div>
//         <div style="background: #f9f9f9; padding: 14px; text-align: center; font-size: 12px; color: #aaa;">
//           This is an automated security notification. Please do not reply.
//         </div>
//       </div>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
//   console.log(`Login email sent to ${user.email}`);
// }

// // ─── POST /login ───────────────────────────────────────────────────────────────
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Validate request body
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and password are required.",
//     });
//   }

//   // Load users from file
//   const users = loadUsers();

//   // Find matching user
//   const user = users.find(
//     (u) =>
//       u.email.toLowerCase() === email.toLowerCase() &&
//       u.password === password
//   );

//   if (!user) {
//     console.log(`Failed login attempt for: ${email}`);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password. Please try again.",
//     });
//   }

//   // Successful login — send email notification
//   console.log(`Successful login: ${user.name} (${user.email})`);

//   try {
//     await sendLoginEmail(user);
//     return res.status(200).json({
//       success: true,
//       message: `Welcome back, ${user.name}! A login notification has been sent to your email.`,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (emailErr) {
//     console.warn("Login succeeded but email failed:", emailErr.message);
//     // Still return success even if email fails
//     return res.status(200).json({
//       success: true,
//       message: `Welcome back, ${user.name}! (Email notification could not be sent.)`,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   }
// });

// // ─── Catch-all: serve login page ──────────────────────────────────────────────
// app.get("/{*path}", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // ─── Start Server ─────────────────────────────────────────────────────────────
// app.listen(PORT, () => {
//   console.log(`Login server running at http://localhost:${PORT}`);
// });
