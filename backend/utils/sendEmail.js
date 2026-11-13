
const transporter = require("../config/mailer");

const sendEmail = async (to, subject, message) => {
    try {
        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message
        });

        return result;

    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;
