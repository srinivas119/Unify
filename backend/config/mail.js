import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: "srinivas.sunkara.2006@gmail.com",
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
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: "UnifyCode <onboarding@resend.dev>",
      to: email,
      subject,
      html,
    });

    if (response.error) {
      console.error("❌ Resend API Error:", response.error);
      throw new Error(response.error.message);
    }

    console.log("✅ Email Sent Successfully. ID:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    throw error;
  }
};
export default sendEmail;
