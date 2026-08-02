import * as Brevo from "@getbrevo/brevo";

// 1. Initialize Brevo API Instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// 2. Set API Key (Must start with xkeysib- from Brevo API Settings tab)
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

/**
 * Sends a transactional email using Brevo HTTP API
 * @param {string} email - Recipient's email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML email body content
 */
const sendEmail = async (email, subject, html) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      name: "UnifyCode",
      email: process.env.EMAIL_USER || "srinivas.sunkara.2006@gmail.com", // Must match verified sender in Brevo
    };
    sendSmtpEmail.to = [{ email: email }];

    console.log(`📡 Sending transactional email to ${email}...`);

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email delivered via Brevo to ${email}. Message ID:`, data.messageId);
    return data;
  } catch (error) {
    console.error(
      `❌ Brevo API Error for ${email}:`,
      error.response?.body || error.message || error
    );
    throw error;
  }
};

export default sendEmail;
