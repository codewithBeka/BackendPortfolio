// nodemailer.config.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., 'gmail', 'outlook', etc.)
    auth: {
        user: 'dagim923@gmail.com', // Your email address
        pass: 'gqqe ksyf lxxg ilrr',    // Your email password or application-specific password
    },
});

export default transporter;