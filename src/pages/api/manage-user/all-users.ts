import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const getAllUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allUser = await prismaClient.account.findMany({
      where: {
        status: 'ACTIVE',
        username: {
          not: {
            equals: 'admin',
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Fetch all users',
      data: {
        users: allUser,
      },
    });
  } catch (e) {
    return res.status(400).json({ message: "Couldn't fetch users" });
  }
};

export default getAllUser;
