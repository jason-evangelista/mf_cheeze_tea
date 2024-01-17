import { parseDate, transformSalesMonth } from '@/constants/salesDates';
import calculateSalesByMonth from '@/utils/calculateSales';
import { prismaClient } from '@/utils/prismaClient';
import { sub } from 'date-fns';
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

      const stepBehindNov = await prismaClient.order.findMany({
        where: {
          order_date: {
            gte: sub(parseDate(prevDateYear?.Dec?.start), { months: 1 }),
            lte: sub(parseDate(prevDateYear?.Dec?.end), { months: 1 }),
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
            prevMonthDecYear,
            'Jan',
            findSalesTarget,
            stepBehindNov
          ),
          Feb: calculateSalesByMonth(
            Jan,
            'Feb',
            findSalesTarget,
            prevMonthDecYear
          ),
          Mar: calculateSalesByMonth(Feb, 'Mar', findSalesTarget, Jan),
          Apr: calculateSalesByMonth(Mar, 'Apr', findSalesTarget, Feb),
          May: calculateSalesByMonth(Apr, 'May', findSalesTarget, Mar),
          June: calculateSalesByMonth(May, 'June', findSalesTarget, Apr),
          July: calculateSalesByMonth(June, 'July', findSalesTarget, May),
          Aug: calculateSalesByMonth(July, 'Aug', findSalesTarget, June),
          Sep: calculateSalesByMonth(Aug, 'Sep', findSalesTarget, July),
          Oct: calculateSalesByMonth(Sep, 'Oct', findSalesTarget, Aug),
          Nov: calculateSalesByMonth(Oct, 'Nov', findSalesTarget, Sep),
          Dec: calculateSalesByMonth(Nov, 'Dec', findSalesTarget, Oct),
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
