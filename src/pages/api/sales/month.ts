import { parseDate, transformSalesMonth } from '@/constants/salesDates';
import calculateSalesByMonth from '@/utils/calculateSales';
import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const salesMonthApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const body = req.body as { year: number; productId?: string };
      const date = transformSalesMonth(body.year);
      const prevDateYear = transformSalesMonth(body.year - 1);

      const findSalesTarget = await prismaClient.salesTarget.findMany({
        where: {
          type: 'MONTH',
          year: body?.year,
        },
      });

      const [Jan, Feb, Mar, Apr, May, June, July, Aug, Sep, Oct, Nov, Dec] =
        await Promise.all([
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Jan?.start),
                lte: parseDate(date?.Jan?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Feb?.start),
                lte: parseDate(date?.Feb?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Mar?.start),
                lte: parseDate(date?.Mar?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Apr?.start),
                lte: parseDate(date?.Apr?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.May?.start),
                lte: parseDate(date?.May?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.June?.start),
                lte: parseDate(date?.June?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.July?.start),
                lte: parseDate(date?.July?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Aug?.start),
                lte: parseDate(date?.Aug?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Sep?.start),
                lte: parseDate(date?.Sep?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Oct?.start),
                lte: parseDate(date?.Oct?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Nov?.start),
                lte: parseDate(date?.Nov?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Dec?.start),
                lte: parseDate(date?.Dec?.end),
              },
              ...(body.productId && {
                AND: {
                  product_id: body.productId,
                },
              }),
            },
          }),
        ]);

      const prevMonthDecYear = await prismaClient.order.findMany({
        where: {
          order_date: {
            gte: parseDate(prevDateYear?.Dec?.start),
            lte: parseDate(prevDateYear?.Dec?.end),
          },
          ...(body.productId && {
            AND: {
              product_id: body.productId,
            },
          }),
        },
      });

      return res.status(200).json({
        message: 'Fetched all sales by month',
        data: {
          Jan: calculateSalesByMonth(
            Jan,
            'Jan',
            findSalesTarget,
            prevMonthDecYear
          ),
          Feb: calculateSalesByMonth(Feb, 'Feb', findSalesTarget, Jan),
          Mar: calculateSalesByMonth(Mar, 'Mar', findSalesTarget, Feb),
          Apr: calculateSalesByMonth(Apr, 'Apr', findSalesTarget, Mar),
          May: calculateSalesByMonth(May, 'May', findSalesTarget, Apr),
          June: calculateSalesByMonth(June, 'June', findSalesTarget, May),
          July: calculateSalesByMonth(July, 'July', findSalesTarget, June),
          Aug: calculateSalesByMonth(Aug, 'Aug', findSalesTarget, July),
          Sep: calculateSalesByMonth(Sep, 'Sep', findSalesTarget, Aug),
          Oct: calculateSalesByMonth(Oct, 'Oct', findSalesTarget, Sep),
          Nov: calculateSalesByMonth(Nov, 'Nov', findSalesTarget, Oct),
          Dec: calculateSalesByMonth(Dec, 'Dec', findSalesTarget, Nov),
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

export default salesMonthApi;
