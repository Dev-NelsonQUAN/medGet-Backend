const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.gmail.com",
  // port: 456,
  // port: 587,
  // secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  debug: true,
  logger: true,
});

const sendverificationEmail = async (email, token, type) => {
  //   const frontendUrl = process.env.FRONTEND_URL;

  let verificationUrl = "";

  if (type === "user") {
    verificationUrl = `http://localhost:5173/verify/${token}`;
  } else if (type === "pharmacy") {
    verificationUrl = `http://localhost:5173/pharm-verify/${token}`;
  } else {
    console.error( "Invalid email verification type", type);
    return;
  }

  // const verificationUrl = `https://med-get-global.vercel.app/#/verify/${token}`;

  const mailOptions = {
    from: `"MedGet, Your medical guy." <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
       <div>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationUrl}" style="text-decoration: none;">
          <button style="background-color: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; font-size: 1rem;" onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
            Verify Email
          </button>
        </a>
      </div>

    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendverificationEmail };
