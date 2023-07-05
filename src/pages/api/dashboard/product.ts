import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const dashboardProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const getProducts = await prismaClient.product.findMany({
        where: { status: 'ACTIVE' },
      });
      return res.status(200).json({
        message: 'Successfully fetch products',
        data: { products: getProducts, productCount: getProducts.length },
      });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default dashboardProduct;
