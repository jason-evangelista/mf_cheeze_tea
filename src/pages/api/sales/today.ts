import { calculateSalesByDay } from '@/utils/calculateSales';
import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const salesTodayApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const body = req.body as {
        start_date: string;
        end_date: string;
        productId?: string;
      };

      const startDate = new Date(body?.start_date);
      const endtDate = new Date(body?.end_date);

      const getOrder = await prismaClient.order.findMany({
        where: {
          ...(body.productId && {
            product_id: body?.productId,
          }),
          order_date: {
            gte: new Date(startDate),
            lte: new Date(endtDate),
          },
        },
      });

      const daySales = await calculateSalesByDay(getOrder, startDate, endtDate);

      return res.status(200).json({
        message: 'Fetched order by day',
        data: {
          ...daySales,
        },
      });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default salesTodayApi;
