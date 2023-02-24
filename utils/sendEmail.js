const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    let transporter =  nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL, 
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.SMTP_MAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
  
    await transporter.sendMail(mailOptions);
  };

module.exports =sendEmail;