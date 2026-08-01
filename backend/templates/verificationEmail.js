const verificationEmail = (username, link) => {

return `

<div style="font-family:Arial;padding:30px">

<h2>Welcome ${username} 👋</h2>

<p>

Thank you for joining UnifyCode.

</p>

<p>

Click the button below to verify your account.

</p>

<a href="${link}"

style="

background:#2563eb;

padding:15px 25px;

color:white;

text-decoration:none;

border-radius:5px;

display:inline-block;

">

Verify Email

</a>

<br><br>

<p>

If you didn't create this account, ignore this email.

</p>

</div>

`;

}

export default verificationEmail;