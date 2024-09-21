const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Secret key for JWT (Keep this secret and safe in a production environment)
const SECRET_KEY = "your_secret_key";

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Your MySQL password
  database: "loom_diary",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "loomdiary100@gmail.com",
    pass: "tabezwvvfhgqtoeg",
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateEmailHTML(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loom Diary OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px; overflow: hidden;">
        <tr>
          <td style="padding: 20px;">
            <h1 style="color: #4a4a4a; text-align: center; margin-bottom: 20px;">Your OTP for Signup</h1>
            <div style="background-color: #ffffff; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; margin-bottom: 20px;">Thank you for signing up! Please use the following One-Time Password (OTP) to complete your registration:</p>
              <div style="background-color: #e8f0fe; border-radius: 5px; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin-bottom: 20px;">
                ${otp}
              </div>
              <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
            </div>
            <p style="font-size: 14px; text-align: center; margin-top: 20px; color: #888;">If you didn't request this OTP, please ignore this email.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

app.post("/send-otp", (req, res) => {
  const { email, mobile, fullName } = req.body;

  // Check if email or mobile number already exists
  const checkQuery = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkQuery, [email, mobile], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message:
          results[0].email === email
            ? "This email is already registered."
            : "This mobile number is already registered.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the database (you might want to create a new table for this)
    const storeOTPQuery =
      "INSERT INTO otp_storage (email, otp, created_at) VALUES (?, ?, NOW())";
    db.query(storeOTPQuery, [email, otp], (err, result) => {
      if (err) {
        console.error("Error storing OTP:", err);
        return res.status(500).json({ message: "Server error" });
      }

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Signup",
        html: generateEmailHTML(otp),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending OTP email:", error);
          return res.status(500).json({ message: "Error sending OTP email" });
        }
        res
          .status(200)
          .json({ message: "OTP sent successfully. Please check your email." });
      });
    });
  });
});

// Verify OTP and Complete Signup
app.post("/verify-otp", (req, res) => {
  const { email, otp, password, mobile, fullName } = req.body;

  // Verify OTP
  const verifyOTPQuery =
    "SELECT * FROM otp_storage WHERE email = ? AND otp = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)";
  db.query(verifyOTPQuery, [email, otp], (err, results) => {
    if (err) {
      console.error("Error verifying OTP:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, proceed with user registration
    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query =
      "INSERT INTO users (userid, fullName, email, mobile, password, is_verified) VALUES (?,?, ?, ?, ?, ?)";
    db.query(
      query,
      [userId, fullName, email, mobile, hashedPassword, true],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ message: "Server error" });
        }

        // Delete the used OTP
        db.query("DELETE FROM otp_storage WHERE email = ?", [email]);

        res.status(200).json({
          message: "User registered successfully. You can now log in.",
        });
      }
    );
  });
});

// Signup Route (with UUID and hashed password)
app.post("/signup", (req, res) => {
  const { fullName, email, mobile, password } = req.body; // Include fullName
  console.log(fullName, email, mobile, password);

  // Check if email or mobile number already exists
  const checkQuery = "SELECT * FROM users WHERE email = ? OR mobile = ?";
  db.query(checkQuery, [email, mobile], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message:
          results[0].email === email
            ? "This email is already registered."
            : "This mobile number is already registered.",
      });
    }

    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationToken = jwt.sign({ userId: userId }, SECRET_KEY, {
      expiresIn: "1d",
    });

    const query =
      "INSERT INTO users (userid, fullName, email, mobile, password, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        userId,
        fullName,
        email,
        mobile,
        hashedPassword,
        false,
        verificationToken,
      ],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ message: "Server error" });
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Email Verification",
          html: `
            <h1>Verify Your Email</h1>
            <p>Click the link below to verify your email address:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending verification email:", error);
            return res
              .status(500)
              .json({ message: "Error sending verification email" });
          }
          res.status(200).json({
            message:
              "User registered successfully. Please check your email to verify your account.",
          });
        });
      }
    );
  });
});

app.get("/verify-email/:token", (req, res) => {
  const { token } = req.params;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    const userId = decoded.userId;

    // Update user's verification status
    const query =
      "UPDATE users SET is_verified = true, verification_token = NULL WHERE userid = ?";
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error updating user verification status:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res
        .status(200)
        .json({ message: "Email verified successfully. You can now log in." });
    });
  });
});

// Login Route (with JWT)
app.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  // Fetch user by mobile number
  const query = "SELECT * FROM users WHERE mobile = ?";
  db.query(query, [mobile], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // Compare password
    if (bcrypt.compareSync(password, user.password)) {
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      // Send the token to the client
      res
        .status(200)
        .json({ message: "Login successful", user: user, mytoken: token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the database
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the database
    const storeOTPQuery =
      "INSERT INTO otp_storage (email, otp, created_at) VALUES (?, ?, NOW())";
    db.query(storeOTPQuery, [email, otp], (err, result) => {
      if (err) {
        console.error("Error storing OTP:", err);
        return res.status(500).json({ message: "Server error" });
      }

      // Send OTP via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        html: generateEmailHTML(otp, "Password Reset"),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending OTP email:", error);
          return res.status(500).json({ message: "Error sending OTP email" });
        }
        res
          .status(200)
          .json({ message: "OTP sent successfully. Please check your email." });
      });
    });
  });
});

// Verify OTP Route
app.post("/forgot-password-verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const verifyOTPQuery =
    "SELECT * FROM otp_storage WHERE email = ? AND otp = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)";
  db.query(verifyOTPQuery, [email, otp], (err, results) => {
    if (err) {
      console.error("Error verifying OTP:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  });
});

// Reset Password Route
app.post("/reset-password", (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Verify OTP again
  const verifyOTPQuery =
    "SELECT * FROM otp_storage WHERE email = ? AND otp = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)";
  db.query(verifyOTPQuery, [email, otp], (err, results) => {
    if (err) {
      console.error("Error verifying OTP:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updatePasswordQuery, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Server error" });
      }

      // Delete the used OTP
      db.query("DELETE FROM otp_storage WHERE email = ?", [email]);

      res.status(200).json({ message: "Password reset successfully" });
    });
  });
});

// Create a new khata
app.post("/api/khatas", authenticateJWT, (req, res) => {
  const { Name } = req.body;
  const userId = req.user.userId;

  const query = "INSERT INTO khatas (name, user_id) VALUES (?, ?)";
  db.query(query, [Name, userId], (err, result) => {
    if (err) {
      console.error("Error adding khata:", err);
      return res.status(500).json({ message: "Error adding khata" });
    }
    res
      .status(201)
      .json({ id: result.insertId, Name, message: "Khata added successfully" });
  });
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Authorization token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user; // Attach user data to request object
    next();
  });
};

// Example of a protected route
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    userId: req.user.userId,
  });
});

// Listen on the port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
