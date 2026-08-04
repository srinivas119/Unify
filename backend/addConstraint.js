import pool from "./config/database.js";

async function addConstraint() {
    try {
        console.log("Adding unique constraint to username...");
        await pool.query(`ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE(username);`);
        console.log("Successfully added unique constraint.");
    } catch (err) {
        if (err.code === '42P04') {
             console.log("Constraint already exists.");
        } else {
             console.error("Error adding constraint:", err);
        }
    } finally {
        process.exit(0);
    }
}

addConstraint();
