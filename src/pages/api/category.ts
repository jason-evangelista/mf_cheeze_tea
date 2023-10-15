import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const categoryApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const getProductCategory = await prismaClient.productCategory.findMany();

      return res.status(200).json({
        message: 'Fetched Product Category',
        data: {
          productCategory: getProductCategory,
        },
      });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'Something went wrong, please try again' });
  }
};

export default categoryApi;
