import transporter from "../config/mail.js";

const sendEmail = async (

email,

subject,

html

)=>{

try{

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:email,

subject,

html

});

console.log("✅ Email Sent");

}

catch(err){

console.log(err);

}

}

export default sendEmail;