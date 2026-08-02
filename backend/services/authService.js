import pool from "../config/database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
export const checkUserExists = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
};

export const createUser = async (username, email, password) => {

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomUUID();

    const result = await pool.query(
        `
        INSERT INTO users
        (
            username,
            email,
            password,
            is_verified
        )
        VALUES($1,$2,$3,false)
        RETURNING *
        `,
        [
            username,
            email,
            hashedPassword
        ]
    );

    return {
        user: result.rows[0],
        verificationToken
    };
};