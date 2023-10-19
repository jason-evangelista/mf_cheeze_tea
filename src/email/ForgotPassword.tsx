import { Button } from '@react-email/button';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Text } from '@react-email/text';

type Props = {
  email: string;
  username: string;
};

const ForgotPassword = ({ email, username }: Props) => {
  return (
    <Html>
      <Head>Reset Password | MF Cheeze Tea</Head>
      <br />
      <Text>Hello {username}, you&apos;ve request to reset your password.</Text>
      <Button
        href={
          process.env.NODE_ENV === 'production'
            ? `https://mf-cheeze-tea.vercel.app/reset-password?email=${email}`
            : `http://localhost:3000/reset-password?email=${email}`
        }
        className="bg-blue-500 text-white rounded-sm"
      >
        Click here to Reset Password
      </Button>
      <br />
      <Text>
        Please disregard the email if you&apos;ve not request this action, Thank you.
      </Text>
    </Html>
  );
};

export default ForgotPassword;
