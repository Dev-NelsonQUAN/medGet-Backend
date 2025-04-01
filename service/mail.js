const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
    debug: true,
    logger: true,
});

const sendverificationEmail = async (email, token, type) => {
    const baseUrl = process.env.MEDGET_VERCEL_APP;

    if (!baseUrl) {
        console.error("MEDGET_VERCEL_APP environment variable is not defined.");
        return;
    }

    let verificationUrl = "";

    if (type === "user") {
        verificationUrl = `${baseUrl}/verify/${token}`;
    } else if (type === "pharmacy") {
        verificationUrl = `${baseUrl}/pharm-verify/${token}`;
    } else {
        console.error("Invalid email verification type", type);
        return;
    }

    const mailOptions = {
        from: `"MedGet, Your medical guy." <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html: `
        <div style="font-family: 'Poppins', sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 400px; margin: 0 auto;">
            <div style="background-color: #2563eb; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 20px;">MedGet</h1>
            </div>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                <p style="font-size: 14px; margin-bottom: 30px; color: #555;">
                    Welcome to MedGet! Please verify your email address by clicking the button below to gain full access to our platform.
                </p>
                <a href="${verificationUrl}" style="text-decoration: none;">
                    <button style="font-family: 'Poppins', sans-serif; background-color: #2563eb; color: #ffffff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; transition: background-color 0.3s ease;">
                        Verify Email
                    </button>
                </a>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
                This is an automated message. Please do not reply.
            </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendverificationEmail };
