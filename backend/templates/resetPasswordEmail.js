const resetPasswordEmail = (username, link) => {
    return `
        <div style="font-family:Arial;padding:30px">
            <h2>Hello ${username} 👋</h2>
            <p>You recently requested to reset your password for your UnifyCode account.</p>
            <p>Click the button below to reset it.</p>
            <a href="${link}" style="background:#2563eb;padding:15px 25px;color:white;text-decoration:none;border-radius:5px;display:inline-block;">Reset Password</a>
            <br><br>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
    `;
}

export default resetPasswordEmail;
