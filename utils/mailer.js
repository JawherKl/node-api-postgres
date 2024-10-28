const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome!',
    text: `Hello ${name}, welcome to our service!`,
  });
};

module.exports = { sendWelcomeEmail };