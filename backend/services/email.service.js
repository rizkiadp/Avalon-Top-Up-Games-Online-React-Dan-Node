const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("!!! EMAIL SERVICE LOADED - DEBUG VERSION !!!");
console.log("SMTP_USER:", process.env.SMTP_USER ? "SET" : "MISSING");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET" : "MISSING");


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Check if credentials are set
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("WARNING: SMTP_USER or SMTP_PASS is missing in .env. Email sending will fail.");
}

const sendOTP = async (email, otp) => {
    // DEV MODE: Log OTP to console for easy testing if smtp is invalid
    const isDev = !process.env.SMTP_USER || !process.env.SMTP_PASS;

    if (isDev) {
        console.log('\n==================================================');
        console.log(' [DEV MODE] SMTP Credentials Missing');
        console.log(` [OTP] for ${email}: ${otp}`);
        console.log('==================================================\n');
        return true; // Pretend it was sent successfully
    }

    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Avalon Games - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify Your Email</h2>
                    <p>Your One-Time Password (OTP) for Avalon Games is:</p>
                    <h1 style="color: #4A90E2; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request this code, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);

        // Fallback for errors even if creds were present
        console.log('\n==================================================');
        console.log(' [FALLBACK] Email failed to send');
        console.log(` [OTP] for ${email}: ${otp}`);
        console.log('==================================================\n');

        return true; // Return true to allow user to proceed with the console OTP
    }
};

module.exports = { sendOTP };
