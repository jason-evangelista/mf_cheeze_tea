import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.query?.id as string;
    if (req.method === 'DELETE') {
      const findUserDelete = await prismaClient.account.findUnique({
        where: {
          id,
        },
      });

      if (findUserDelete) {
        const deleteUser = await prismaClient.account.update({
          where: {
            id: findUserDelete?.id,
          },
          data: {
            status: 'INACTIVE',
          },
        });

        await prismaClient.account.delete({
          where: {
            id: findUserDelete?.id,
          },
        });

        if (deleteUser)
          return res.status(200).json({ message: 'User successfully deleted' });
      } else {
        return res.status(200).json({ message: 'User not exist' });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Couldn't delete user" });
  }
};

export default deleteUser;
