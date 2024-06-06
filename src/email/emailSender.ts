import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import ForgotPassword from './ForgotPassword';

const emailSender = async (email: string, username: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: 'mfcheeze-tea@formvey.com',
      pass: '@mfcheeze_jason22',
    },
  });

  const emailTemplate = render(ForgotPassword({ email, username }));

  const options = {
    from: 'mfcheeze-tea@formvey.com',
    to: email,
    subject: 'Reset Password',
    html: emailTemplate,
  };

  const data = await transporter.sendMail(options);
  return data;
};

export default emailSender;
