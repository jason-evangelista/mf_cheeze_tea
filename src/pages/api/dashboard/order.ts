import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const dashboardOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const getOrders = await prismaClient.order.findMany({
        where: { status: 'ACTIVE', order_date: {} },
      });
      const totalSales = getOrders.reduce(
        (prev, { sub_total }) => prev + sub_total,
        0
      );

      return res.status(200).json({
        message: 'Successfully fetch products',
        data: { orders: getOrders, orderCount: getOrders.length, totalSales },
      });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default dashboardOrder;
