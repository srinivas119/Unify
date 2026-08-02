import * as Brevo from "@getbrevo/brevo";

// Initialize Brevo API Instance
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (email, subject, html) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      name: "UnifyCode",
      email: process.env.EMAIL_USER || "srinivas.sunkara.2006@gmail.com",
    };
    sendSmtpEmail.to = [{ email: email }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent via Brevo to ${email}. Message ID:`, data.messageId);
    return data;
  } catch (error) {
    console.error(`❌ Brevo email failure for ${email}:`, error.response?.body || error.message);
    throw error;
  }
};

export default sendEmail;