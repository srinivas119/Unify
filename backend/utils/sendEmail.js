import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

// Set API Key
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
      email: "srinivas.sunkara.2006@gmail.com", // MUST match your verified Brevo sender
    };
    sendSmtpEmail.to = [{ email: email }];

    console.log(`📡 Sending email via Brevo to ${email}...`);

    // Await the API response
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log("✅ Brevo API Full Response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("❌ BREVO ERROR DETAILS:", error.response?.body || error.message || error);
    throw error;
  }
};

export default sendEmail;
