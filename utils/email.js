
const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, link) => {
  
  

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from:`"No Reply" <zahrasamar88@gmail.com>`,
    to,
    subject,
    html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 30px; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333333; font-size: 24px; text-align: center; margin-bottom: 20px;">Reset Your Password</h2>
        <p style="color: #555555; font-size: 16px; text-align: center; margin-bottom: 30px;">We received a request to reset your password. Please click the button below to proceed:</p>
        <div style="text-align: center; margin-bottom: 40px;">
          <a href="${link}" style="background-color: #4bcdeb; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 16px; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 2px 8px rgba(75, 205, 235, 0.2); transition: background-color 0.3s ease;">Reset Password</a>
        </div>
        <p style="color: #777777; font-size: 14px; text-align: center; margin-bottom: 20px;">If the button doesn't work, copy and paste the following link into your browser:</p>
        <div style="text-align: center; word-break: break-all;">
          <a href="${link}" style="color: #4bcdeb; font-size: 14px; word-break: break-all;">${link}</a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #555555; font-size: 14px;">If you did not request a password reset, please ignore this email.</p>
        <p style="color: #555555; font-size: 14px;">Best regards,<br>Your Company Name</p>
      </div>
    </div>
  `
  
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
module.exports = { sendEmail };