import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

function sendEmail(email) {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // ✅ Updated verify URL (use query param if needed or React Route param)
  const verifyLink = `http://localhost:3000/verify?token=${token}`; // use /verify?token=xxx

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>Welcome to Our Platform</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyLink}" target="_blank" style="color: blue;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log('✅ Verification email sent: ' + info.response);
    }
  });
}

export default sendEmail;