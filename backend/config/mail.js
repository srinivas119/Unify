import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  pool: true,   // Keep connection open
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Prevents cloud IP SSL handshake failures
  }
});

const sendEmail = async (email, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"UnifyCode" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${email}. MessageID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error);
    throw error;
  }
};

export default sendEmail;
