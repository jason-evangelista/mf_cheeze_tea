import { parseDate, transformSalesMonth } from '@/constants/salesDates';
import { calculateSalesByYear } from '@/utils/calculateSales';
import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const salesYearApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const body = req.body as {
        start_year: number;
        end_year: number;
        productId: string;
      };
      const startDate = transformSalesMonth(body.start_year);
      const endDate = transformSalesMonth(body.end_year);

      // const findYearSalesTarget = await prismaClient.salesTarget.findMany({
      //   where: {
      //     type: 'YEAR',
      //   },
      // });

      const getSpanYear = await prismaClient.order.findMany({
        where: {
          status: 'ACTIVE',
          order_date: {
            gte: parseDate(startDate.Jan.start),
            lte: parseDate(endDate.Dec.end),
          },
          ...(body?.productId && {
            product_id: body?.productId,
          }),
        },
      });

      const yearSales = await calculateSalesByYear(
        body?.start_year,
        body?.end_year,
        getSpanYear
      );

      return res.status(200).json({
        message: 'Fetch year sales',
        data: {
          ...yearSales,
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

export default salesYearApi;
