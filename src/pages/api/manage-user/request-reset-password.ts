import emailSender from '@/email/emailSender';
import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

const requestPasswordApi = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (req.method === 'POST') {
      const { email } = req.body as { email: string };

      const findUser = await prismaClient.account.findUnique({
        where: {
          email,
        },
      });

      if (findUser?.reset_id)
        return res
          .status(401)
          .json({ message: 'Password reset already sent to email.' });

      if (findUser) {
        const token = await prismaClient.account.update({
          where: {
            id: findUser?.id,
          },
          data: {
            reset_id: uuid(),
          },
        });
        if (token) {
          await emailSender(findUser?.email ?? '', findUser?.username);
          return res
            .status(200)
            .json({ message: 'Password reset sent to your email' });
        }
      } else {
        return res.status(404).json({ message: 'User not exist.' });
      }
    }
  } catch (e) {
    return res.status(400).json({
      message: 'Error requesting password reset, Please try again',
    });
  }
};

export default requestPasswordApi;
