import { BrevoClient } from "@getbrevo/brevo";

// Initialize Brevo Client
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

/**
 * Sends a transactional email using Brevo
 */
const sendEmail = async (email, subject, html) => {
  try {
    console.log(`📡 Sending transactional email to ${email}...`);

    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: html,
      sender: {
        name: "UnifyCode",
        email: process.env.EMAIL_USER || "srinivas.sunkara.2006@gmail.com",
      },
      to: [{ email: email }],
    });

    console.log(`✅ Email sent successfully to ${email}. Message ID:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`❌ Brevo API Error for ${email}:`, error.message || error);
    throw error;
  }
};

export default sendEmail;
