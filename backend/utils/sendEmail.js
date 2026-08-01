import transporter from "../config/mail.js";

const sendEmail = async (email, subject, html) => {
  try {
    console.log("📧 Sending email to:", email);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });

    console.log("✅ Email Sent");
    console.log(info);

    return info;
  } catch (err) {
    console.error("❌ Email Error:", err);
    throw err; // Important: pass the error to the signup controller
  }
};

export default sendEmail;
