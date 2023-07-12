import { parseMonthToNumber } from '@/constants/parseMonth';
import { prismaClient } from '@/utils/prismaClient';
import { endOfMonth, format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

const dashboardOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const query = req.body as {
        type: string;
        acroMonth: number;
        year: number;
        productId?: string;
      };

      if (query.type === 'Month') {
        const firstDate = new Date(
          +query.year ?? new Date().getFullYear(),
          isNaN(Number(query.acroMonth))
            ? +parseMonthToNumber[query.acroMonth] ?? new Date().getMonth()
            : query.acroMonth,
          1
        );
        const getOrders = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            order_date: {
              gte: firstDate,
              lte: endOfMonth(firstDate),
            },
            ...(query.productId && {
              product_id: query.productId,
            }),
          },
        });

        const totalSales = getOrders.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );

        return res.status(200).json({
          message: 'Successfully fetch products',
          data: {
            orders: getOrders,
            orderCount: getOrders.length,
            totalSales,
            date: {
              type: 'Month',
              label: format(firstDate, 'MMMM yyyy'),
            },
          },
        });
      }

      if (query.type === 'Year') {
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
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default dashboardOrder;
