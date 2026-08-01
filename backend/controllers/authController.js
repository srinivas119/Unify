import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { checkUserExists, createUser } from "../services/authService.js";
import sendEmail from "../utils/sendEmail.js";
import verificationEmail from "../templates/verificationEmail.js";

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

        const { user } = await createUser(
            username,
            email,
            password
        );

        const verificationToken = crypto.randomUUID();

        await pool.query(

            `
            INSERT INTO email_verifications
            (
                user_id,
                verification_token,
                expires_at
            )
            VALUES($1,$2,NOW()+INTERVAL '1 day')
            `,
            [
                user.id,
                verificationToken
            ]

        );

        const link =
`http://localhost:5000/api/auth/verify/${verificationToken}`;

        await sendEmail(

            email,

            "Verify your UnifyCode Account",

            verificationEmail(username, link)

        );

        return res.status(201).json({

            success: true,

            message:
            "Registration successful. Check your email."

        });

    }

    catch (err) {

        console.log(err);

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

        const { token } = req.params;

        const result = await pool.query(

            `
            SELECT *
            FROM email_verifications
            WHERE verification_token=$1
            `,
            [token]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Invalid verification link"

            });

        }

        const verification = result.rows[0];

        await pool.query(

            `
            UPDATE users
            SET is_verified=true
            WHERE id=$1
            `,
            [verification.user_id]

        );

        await pool.query(

            `
            DELETE
            FROM email_verifications
            WHERE user_id=$1
            `,
            [verification.user_id]

        );

        return res.json({

            success: true,

            message: "Email Verified Successfully"

        });

    }

    catch (err) {

        console.log(err);

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

        const match = await bcrypt.compare(
            password,
            user.password
        );

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

            {

                id: user.id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

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

    }

    catch (err) {

        console.log(err);

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
            SELECT
            id,
            username,
            email,
            is_verified
            FROM users
            WHERE id=$1
            `,
            [req.user.id]

        );

       return res.redirect(
  "http://localhost:5173/login"
);

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};