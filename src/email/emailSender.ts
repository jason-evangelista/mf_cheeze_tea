import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import ForgotPassword from './ForgotPassword';

const emailSender = async (email: string, username: string) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mfcheeze-support@insider-hub.com',
      pass: '#Ai-p2HhTq_fLC3',
    },
  });

  const emailTemplate = render(ForgotPassword({ email, username }));

  const options = {
    from: 'mfcheeze-support@insider-hub.com',
    to: email,
    subject: 'Reset Password',
    html: emailTemplate,
  };

  const data = await transporter.sendMail(options);
  return data;
};

export default emailSender;
