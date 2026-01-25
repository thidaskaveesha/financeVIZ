import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send verification email with code
 * @param {string} email - Recipient email
 * @param {number} code - Verification code
 * @param {string} type - 'verification' or 'reset'
 * @returns {Promise<boolean>} True if email sent successfully
 */
export async function sendVerificationEmail(email, code, type = 'verification') {
  const subject = type === 'reset' 
    ? 'Password Reset Code - FinanceVIZ' 
    : 'Email Verification Code - FinanceVIZ';
  
  const message = type === 'reset'
    ? `Your password reset code is: ${code}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this, please ignore this email.`
    : `Your email verification code is: ${code}\n\nPlease enter this code to verify your email address.\n\nIf you didn't create an account, please ignore this email.`;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="font-size: 16px; color: #666;">Your ${type === 'reset' ? 'password reset' : 'verification'} code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p style="font-size: 14px; color: #999;">
            ${type === 'reset' ? 'This code will expire in 5 minutes.' : 'Please enter this code to verify your email address.'}
          </p>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            If you didn't ${type === 'reset' ? 'request this' : 'create an account'}, please ignore this email.
          </p>
        </div>
      `,
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}
