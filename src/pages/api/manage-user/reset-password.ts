import { prismaClient } from '@/utils/prismaClient';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const resetPasswordApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const email = req.query?.email as string;

      const findUser = await prismaClient.account.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          username: true,
          reset_id: true,
        },
      });

      if (findUser?.reset_id) {
        return res.status(200).json({ data: { user: findUser } });
      } else {
        return res.status(200).json({ data: { user: null } });
      }
    }

    if (req.method === 'PUT') {
      const { email, newPassword } = req.body as {
        email: string;
        newPassword: string;
      };

      const hashPassword = await bcrypt.hash(newPassword, 10);

      const updateUser = await prismaClient.account.update({
        where: {
          email,
        },
        data: {
          password: hashPassword,
          reset_id: null,
        },
        select: {
          email: true,
          username: true,
        },
      });

      if (updateUser) {
        return res.status(200).json({ message: 'Password has been changed.' });
      }
    }
  } catch (e) {
    return res.status(400).json({
      message: 'Error requesting password reset, Please try again',
    });
  }
};

export default resetPasswordApi;
