import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: "UnifyCode <onboarding@resend.dev>",
      to: email,
      subject,
      html,
    });

    console.log("✅ Email Sent successfully:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    throw error; // Re-throw so controller catch block catches it
  }
};

export default sendEmail;