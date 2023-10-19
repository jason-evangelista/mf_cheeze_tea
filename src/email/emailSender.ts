import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import ForgotPassword from './ForgotPassword';

const emailSender = async (email: string, username: string) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAILER_USER,
      pass: process.env.EMAILER_PASSWORD,
    },
  });

  const emailTemplate = render(ForgotPassword({ email, username }));

  const options = {
    from: process.env.EMAILER_USER,
    to: email,
    subject: 'Reset Password',
    html: emailTemplate,
  };

  const data = await transporter.sendMail(options);
  return data;
};

export default emailSender;
