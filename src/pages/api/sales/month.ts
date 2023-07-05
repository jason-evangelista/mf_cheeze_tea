import { parseDate, transformSalesMonth } from '@/constants/salesDates';
import calculateSalesByMonth from '@/utils/calculateSales';
import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const salesMonthApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const body = req.body as { year: number };
      const date = transformSalesMonth(body.year);

      const findSalesTarget = await prismaClient.salesTarget.findMany({
        where: {
          type: 'MONTH',
          year: body?.year,
        },
      });

      console.log({
        check: findSalesTarget.find((item) => item.month?.match('July')),
      });

      const [Jan, Feb, Mar, Apr, May, June, July, Aug, Sep, Oct, Nov, Dec] =
        await Promise.all([
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Jan?.start),
                lte: parseDate(date?.Jan?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Feb?.start),
                lte: parseDate(date?.Feb?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Mar?.start),
                lte: parseDate(date?.Mar?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Apr?.start),
                lte: parseDate(date?.Apr?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.May?.start),
                lte: parseDate(date?.May?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.June?.start),
                lte: parseDate(date?.June?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.July?.start),
                lte: parseDate(date?.July?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Aug?.start),
                lte: parseDate(date?.Aug?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Sep?.start),
                lte: parseDate(date?.Sep?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Oct?.start),
                lte: parseDate(date?.Oct?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Nov?.start),
                lte: parseDate(date?.Nov?.end),
              },
            },
          }),
          await prismaClient.order.findMany({
            where: {
              order_date: {
                gte: parseDate(date?.Dec?.start),
                lte: parseDate(date?.Dec?.end),
              },
            },
          }),
        ]);

      return res.status(200).json({
        message: 'Fetched all sales by month',
        data: {
          Jan: calculateSalesByMonth(Jan, 'Jan', findSalesTarget),
          Feb: calculateSalesByMonth(Feb, 'Feb', findSalesTarget),
          Mar: calculateSalesByMonth(Mar, 'Mar', findSalesTarget),
          Apr: calculateSalesByMonth(Apr, 'Apr', findSalesTarget),
          May: calculateSalesByMonth(May, 'May', findSalesTarget),
          June: calculateSalesByMonth(June, 'June', findSalesTarget),
          July: calculateSalesByMonth(July, 'July', findSalesTarget),
          Aug: calculateSalesByMonth(Aug, 'Aug', findSalesTarget),
          Sep: calculateSalesByMonth(Sep, 'Sep', findSalesTarget),
          Oct: calculateSalesByMonth(Oct, 'Oct', findSalesTarget),
          Nov: calculateSalesByMonth(Nov, 'Nov', findSalesTarget),
          Dec: calculateSalesByMonth(Dec, 'Dec', findSalesTarget),
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
