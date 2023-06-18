import userSelectedValue from '@/constants/returnUser';
import { GenerateAccountSchema, SignInSchema } from '@/schema/schema';
import { jwtDecode, jwtGenerate } from '@/utils/jwtService';
import { prismaClient } from '@/utils/prismaClient';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const userApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const type = req.query?.type;
  const body = req.body as GenerateAccountSchema | SignInSchema;

  try {
    // Login
    if (req.method === 'POST' && type === 'sign-in') {
      const findUser = await prismaClient.account.findUnique({
        where: {
          username: body?.username,
        },
        select: {
          id: true,
          password: true,
          token: true,
        },
      });

      if (!findUser)
        return res
          .status(404)
          .json({ message: 'Invalid username or password' });

      //compare password
      bcrypt.compare(body.password, findUser.password, (err, isMatched) => {
        if (err)
          return res
            .status(404)
            .json({ message: 'Something went wrong please try again' });

        if (!isMatched)
          return res
            .status(404)
            .json({ message: 'Invalid username or password' });

        return res.status(200).json({
          message: 'Successfully login',
          data: { id: findUser?.id, token: findUser?.token },
        });
      });
    }

    // Create User
    if (req.method === 'POST' && type === 'sign-up') {
      const findUser = await prismaClient.account.findUnique({
        where: {
          username: body?.username,
        },
      });

      if (findUser) {
        return res.status(409).json({ message: 'User already exist' });
      }

      const hashPassword = await bcrypt.hash(body?.password, 10);
      const user = await prismaClient.account.create({
        data: {
          username: body?.username,
          password: hashPassword,
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

    // Fetch user with header token
    if (req.method === 'GET') {
      const getAuthHeader = req.headers.authorization;

      if (!getAuthHeader)
        return res.status(400).json({ message: 'Not authorized', user: null });

      const getJwtDecoded = await jwtDecode({
        secret: process.env.JWT_SECRET ?? '',
        token: getAuthHeader ?? '',
      });

      const findUser = await prismaClient.account.findUnique({
        where: {
          id: getJwtDecoded?.id,
        },
        select: userSelectedValue,
      });

      if (!findUser)
        return res.status(404).json({ message: 'Not authorized', user: null });

      return res.status(200).json({ message: 'Authenticated', user: findUser });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong, please try again' });
  }
};

export default userApi;
