import { jwtGenerate } from '@/utils/jwtService';
import { prismaClient } from '@/utils/prismaClient';
import { Account } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const addUserApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body as Pick<
      Account,
      'account_type' | 'email' | 'password' | 'username'
    >;

    // Create User
    if (req.method === 'POST') {
      const findUser = await prismaClient.account.findUnique({
        where: {
          username: body?.username,
        },
      });
      const findUserEmail = await prismaClient.account.findUnique({
        where: {
          username: body?.email ?? '',
        },
      });

      if (findUser) {
        return res.status(409).json({ message: 'User already exist' });
      }
      if (findUserEmail) {
        return res.status(409).json({ message: 'User already exist' });
      }

      const hashPassword = await bcrypt.hash(body?.password, 10);
      const user = await prismaClient.account.create({
        data: {
          username: body?.username,
          password: hashPassword,
          account_type: body?.account_type,
          email: body?.email,
        },
        select: {
          created_at: true,
          email: true,
          id: true,
          username: true,
          updated_at: true,
          account_type: true,
        },
      });

      if (user) {
        const token = await jwtGenerate({
          payload: { id: user?.id },
          secret: process.env.JWT_SECRET ?? '',
        });
        const addToken = await prismaClient.account.update({
          where: {
            username: user.username,
          },
          data: {
            token,
          },
        });
        if (addToken)
          return res.status(200).json({ message: 'User successfully created' });
      }

      return res.status(400).json({ message: 'Error creating user.' });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message:
        'Error creating account, Please check if username or email address already exists.',
    });
  }
};

export default addUserApi;
