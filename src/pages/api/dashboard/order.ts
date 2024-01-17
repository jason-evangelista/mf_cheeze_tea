import { parseMonthToNumber } from '@/constants/parseMonth';
import calculateNextSalesTarget from '@/utils/calculateNextSalesTarget';
import { prismaClient } from '@/utils/prismaClient';
import { endOfMonth, endOfYear, format, startOfYear, sub } from 'date-fns';
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

        const behindDate = sub(firstDate, { months: 1 });
        const getOrderBehindDate = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            ...(query.productId && {
              product_id: query.productId,
            }),
            order_date: {
              gte: behindDate,
              lte: endOfMonth(behindDate),
            },
          },
        });

        // go back again from behind data
        const stepBehindDate = sub(firstDate, { months: 2 });
        const getOrderStepBehindDate = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            ...(query.productId && {
              product_id: query.productId,
            }),
            order_date: {
              gte: stepBehindDate,
              lte: endOfMonth(stepBehindDate),
            },
          },
        });

        const stepBehindDateTotalSales = getOrderStepBehindDate.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );

        const behindDateTotalSales = getOrderBehindDate.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );

        const totalSales = getOrders.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );

        const growPercentage = (
          ((totalSales - behindDateTotalSales) / behindDateTotalSales) *
          100
        ).toFixed(1);

        const stepBehindDateGrowPercentage =
          ((behindDateTotalSales - stepBehindDateTotalSales) /
            behindDateTotalSales) *
          100;

        //check
        console.log({
          stepBehindDateTotalSales,
          behindDateTotalSales,
          stepBehindDateGrowPercentage,
        });

        return res.status(200).json({
          message: 'Successfully fetch Product Order',
          data: {
            orders: getOrders,
            orderCount: getOrders.length,
            totalSales,
            isSalesGrow: totalSales > behindDateTotalSales,
            growPercentage,
            salesTarget: calculateNextSalesTarget(
              behindDateTotalSales,
              stepBehindDateTotalSales
            ),
            date: {
              type: 'Month',
              label: format(firstDate, 'MMMM yyyy'),
            },
            behindDate: {
              totalSales: behindDateTotalSales,
              date: format(behindDate, 'MMMM yyyy'),
            },
          },
        });
      }

      if (query.type === 'Year') {
        const body = req.body as {
          type: string;
          year: string;
          productId?: string;
        };
        const getOrders = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            order_date: {
              gte: startOfYear(new Date(+body.year, 0)),
              lte: endOfYear(new Date(+body.year, 0)),
            },
            ...(query.productId && {
              product_id: query.productId,
            }),
          },
        });

        const behindDate = sub(new Date(+body.year, 0), { years: 1 });
        const getOrderBehindDate = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            ...(query.productId && {
              product_id: query.productId,
            }),
            order_date: {
              gte: startOfYear(behindDate),
              lte: endOfYear(behindDate),
            },
          },
        });

        const behindDateTotalSales = getOrderBehindDate.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );
        const totalSales = getOrders.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );

        const growPercentage = (
          ((totalSales - behindDateTotalSales) / behindDateTotalSales) *
          100
        ).toFixed(1);

        return res.status(200).json({
          message: 'Successfully fetch Product Order',
          data: {
            orders: getOrders,
            orderCount: getOrders.length,
            totalSales,
            isSalesGrow: totalSales > behindDateTotalSales,
            growPercentage,
            salesTarget: calculateNextSalesTarget(
              totalSales,
              behindDateTotalSales
            ),
            date: {
              type: 'Year',
              label: format(new Date(+body?.year, 0), 'yyyy'),
            },
            behindDate: {
              totalSales: behindDateTotalSales,
              date: format(behindDate, 'yyyy'),
            },
          },
        });
      }

      if (query.type === 'Today') {
        const body = req.body as {
          type: string;
          singleDay: string;
          productId?: string;
        };

        const getOrders = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            order_date: new Date(body?.singleDay),
            ...(query?.productId && {
              product_id: query?.productId,
            }),
          },
        });

        const behindDate = sub(new Date(body?.singleDay), { days: 1 });
        const getOrderBehindDate = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
            ...(query.productId && {
              product_id: query.productId,
            }),
            order_date: behindDate,
          },
        });
        const behindDateTotalSales = getOrderBehindDate.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );
        const totalSales = getOrders.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        );

        const growPercentage = (
          ((totalSales - behindDateTotalSales) / behindDateTotalSales) *
          100
        ).toFixed(1);

        return res.status(200).json({
          message: 'Successfully fetch Product Order',
          data: {
            orders: getOrders,
            orderCount: getOrders.length,
            totalSales,
            isSalesGrow: totalSales > behindDateTotalSales,
            growPercentage,
            date: {
              type: 'Today',
              label: format(new Date(body?.singleDay), 'dd, MMMM yyyy'),
            },
            behindDate: {
              totalSales: behindDateTotalSales,
              date: format(behindDate, 'dd, MMMM yyyy'),
            },
          },
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
