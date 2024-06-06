import { prismaClient } from '@/utils/prismaClient';
import { Account } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const updateUserApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body as Pick<
      Account,
      'account_type' | 'email' | 'password' | 'username' | 'id'
    >;

    // Create User
    if (req.method === 'PUT') {
      const userFindById = await prismaClient.account.findUnique({
        where: {
          id: body?.id,
        },
      });

      const hashPassword = await bcrypt.hash(body?.password, 10);
      const user = await prismaClient.account.update({
        where: {
          id: userFindById?.id,
        },
        data: {
          username: body?.username,
          account_type: body?.account_type,
          email: body?.email,
          ...(body?.password && {
            password: hashPassword,
          }),
        },
        select: {
          created_at: true,
          email: true,
          id: true,
          username: true,
          updated_at: true,
        },
      });

      if (user) {
        return res.status(200).json({ message: 'User successfully update' });
      }

      // return res.status(400).json({ message: 'Error creating user.' });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message:
        'Error updating account, Please check if username or email address already exists.',
    });
  }
};

export default updateUserApi;
