import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your srinivas.sunkara.2006@gmail.com
    pass: process.env.EMAIL_PASS, // Your 16-character App Password
  },
});

const sendEmail = async (email, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"UnifyCode" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("✅ Email sent successfully. MessageID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email via Nodemailer:", error);
    throw error;
  }
};

export default sendEmail;
