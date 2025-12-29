const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const {
  validateEmail,
  validatePassword,
  validateUsername,
} = require("../utils/validators");

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3-50 characters (alphanumeric and underscores only)",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUsers = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUsers.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, passwordHash]
    );

    const user = {
      id: result.rows[0].id,
      username,
      email,
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const users = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (users.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (users.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: users.rows[0],
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Google OAuth authentication
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify the Google ID token
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google credential",
      });
    }

    const googleUser = await response.json();

    // Validate the token is for our app
    if (googleUser.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({
        success: false,
        message: "Invalid token audience",
      });
    }

    const { sub: googleId, email, name } = googleUser;

    // Check if user exists by google_id
    let users = await pool.query(
      "SELECT id, username, email FROM users WHERE google_id = $1",
      [googleId]
    );

    let user;

    if (users.rows.length > 0) {
      // User exists with this Google ID
      user = users.rows[0];
    } else {
      // Check if user exists with this email
      users = await pool.query(
        "SELECT id, username, email, google_id FROM users WHERE email = $1",
        [email]
      );

      if (users.rows.length > 0) {
        // User exists with this email, link Google account
        const existingUser = users.rows[0];

        if (!existingUser.google_id) {
          // Update user to add google_id
          await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [
            googleId,
            existingUser.id,
          ]);
        }

        user = existingUser;
      } else {
        // Create new user
        // Generate a unique username from Google name or email
        let username = name
          ? name.replace(/[^a-zA-Z0-9_]/g, "_").substring(0, 40)
          : email
              .split("@")[0]
              .replace(/[^a-zA-Z0-9_]/g, "_")
              .substring(0, 40);

        // Check if username exists and make it unique
        const usernameCheck = await pool.query(
          "SELECT id FROM users WHERE username = $1",
          [username]
        );

        if (usernameCheck.rows.length > 0) {
          username = `${username}_${Date.now().toString().slice(-6)}`;
        }

        const result = await pool.query(
          "INSERT INTO users (username, email, google_id, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
          [username, email, googleId, null]
        );

        user = result.rows[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during Google authentication",
    });
  }
};

module.exports = { register, login, getMe, googleAuth };
