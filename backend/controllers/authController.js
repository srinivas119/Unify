import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { checkUserExists, createUser } from "../services/authService.js";
// Example in backend/controllers/authController.js
import sendEmail from "../config/mail.js";
import verificationEmail from "../templates/verificationEmail.js";
import resetPasswordEmail from "../templates/resetPasswordEmail.js";

// ========================================
// SIGNUP
// ========================================

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await checkUserExists(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const { user } = await createUser(username, email, password);

        const verificationToken = crypto.randomUUID();

        await pool.query(
            `
            INSERT INTO email_verifications
            (
                user_id,
                verification_token,
                expires_at
            )
            VALUES ($1, $2, NOW() + INTERVAL '1 day')
            `,
            [
                user.id,
                verificationToken
            ]
        );

        // Dynamic Client URL with fallback
        const clientUrl = process.env.CLIENT_URL || "https://unify-pink.vercel.app";
        const link = `${clientUrl}/verify-email?token=${verificationToken}`;

        // ✅ FIXED: Added `await` so Nodemailer finishes sending before responding
        await sendEmail(
            email,
            "Verify your UnifyCode Account",
            verificationEmail(username, link)
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful. Check your email."
        });

    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ========================================
// VERIFY EMAIL
// ========================================

export const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token || req.query.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required"
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM email_verifications
            WHERE verification_token = $1
            `,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid or non-existent verification link"
            });
        }

        const verification = result.rows[0];

        // Check token expiration
        if (new Date(verification.expires_at) < new Date()) {
            await pool.query(
                `DELETE FROM email_verifications WHERE verification_token = $1`,
                [token]
            );

            return res.status(410).json({
                success: false,
                message: "Verification link has expired. Please register again."
            });
        }

        // Mark user as verified
        await pool.query(
            `
            UPDATE users
            SET is_verified = true
            WHERE id = $1
            `,
            [verification.user_id]
        );

        // Delete used token record
        await pool.query(
            `
            DELETE FROM email_verifications
            WHERE user_id = $1
            `,
            [verification.user_id]
        );

        return res.json({
            success: true,
            message: "Email Verified Successfully"
        });

    } catch (err) {
        console.error("Verification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ========================================
// LOGIN
// ========================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await checkUserExists(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        if (!user.is_verified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ========================================
// LOGOUT
// ========================================

export const logout = async (req, res) => {
    return res.json({
        success: true,
        message: "Logout Successful"
    });
};

// ========================================
// CURRENT USER
// ========================================

export const getCurrentUser = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT id, username, email, is_verified
            FROM users
            WHERE id = $1
            `,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (err) {
        console.error("Get Current User Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ========================================
// FORGOT PASSWORD
// ========================================

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await checkUserExists(email);

        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return res.json({
                success: true,
                message: "If an account with that email exists, a reset link has been sent."
            });
        }

        // Create table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                reset_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Delete any existing reset tokens for this user
        await pool.query(
            `DELETE FROM password_reset_tokens WHERE user_id = $1`,
            [user.id]
        );

        const resetToken = crypto.randomUUID();

        await pool.query(
            `
            INSERT INTO password_reset_tokens
            (user_id, reset_token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '1 hour')
            `,
            [user.id, resetToken]
        );

        const clientUrl = process.env.CLIENT_URL || "https://unify-pink.vercel.app";
        const link = `${clientUrl}/reset-password?token=${resetToken}`;

        await sendEmail(
            email,
            "Reset your UnifyCode Password",
            resetPasswordEmail(user.username, link)
        );

        return res.json({
            success: true,
            message: "If an account with that email exists, a reset link has been sent."
        });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ========================================
// RESET PASSWORD
// ========================================

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM password_reset_tokens
            WHERE reset_token = $1
            `,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        const resetData = result.rows[0];

        if (new Date(resetData.expires_at) < new Date()) {
            await pool.query(
                `DELETE FROM password_reset_tokens WHERE reset_token = $1`,
                [token]
            );
            return res.status(410).json({
                success: false,
                message: "Reset token has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE id = $2
            `,
            [hashedPassword, resetData.user_id]
        );

        await pool.query(
            `DELETE FROM password_reset_tokens WHERE user_id = $1`,
            [resetData.user_id]
        );

        return res.json({
            success: true,
            message: "Password reset successfully. You can now login."
        });

    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ========================================
// RESEND VERIFICATION
// ========================================

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await checkUserExists(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified"
            });
        }

        // Delete old tokens
        await pool.query(
            `DELETE FROM email_verifications WHERE user_id = $1`,
            [user.id]
        );

        const verificationToken = crypto.randomUUID();

        await pool.query(
            `
            INSERT INTO email_verifications
            (user_id, verification_token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '1 day')
            `,
            [user.id, verificationToken]
        );

        const clientUrl = process.env.CLIENT_URL || "https://unify-pink.vercel.app";
        const link = `${clientUrl}/verify-email?token=${verificationToken}`;

        await sendEmail(
            email,
            "Verify your UnifyCode Account",
            verificationEmail(user.username, link)
        );

        return res.json({
            success: true,
            message: "Verification email resent. Check your inbox (and spam folder)."
        });

    } catch (err) {
        console.error("Resend Verification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
