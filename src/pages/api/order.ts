import { OrderSchema } from '@/schema/schema';
import { TableProps } from '@/types/TableProps';
import { prismaClient } from '@/utils/prismaClient';
import { add } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

const orderApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const order = req.body as OrderSchema;
      const orderType = order?.product_order_type?.split(' ')[0];
      const addOrder = await prismaClient.order.create({
        data: {
          product_id: order?.product_id ?? '',
          base_amount: order?.product_base_price ?? 0,
          order_date: add(new Date(order?.product_order_date ?? ''), {
            days: 1,
          }),
          order_type_size: orderType ?? '',
          quantity_sale: order?.product_quantity ?? 0,
          sub_total: order?.product_subtotal ?? 0,
        },
      });

      if (!addOrder)
        return res
          .status(400)
          .json({ message: 'Unable to create order, Please try again' });

      return res.status(200).json({ message: 'Order successfully saved' });
    }

    if (req.method === 'GET') {
      const query = req.query as TableProps;

      if (query.showAll === 'true' && !req.query.id) {
        const getAllOrders = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
          },
        });

        return res.status(200).json({
          message: 'Succesfully fetched all orders',
          data: { orders: getAllOrders },
        });
      }

      // Get order for pagination
      if (query.showAll === 'false' && !req.query.id) {
        const query = req.query as TableProps;
        const getOrderSize = await prismaClient.order.count({
          where: {
            status: 'ACTIVE',
          },
        });

        const getTotalSalesAmount = await prismaClient.order
          .findMany({
            where: { status: 'ACTIVE' },
          })
          .then((item) =>
            item.reduce((prev, { sub_total }) => prev + sub_total, 0)
          );

        const getAllOrder = await prismaClient.order.findMany({
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            order_date: 'desc',
          },
          ...(+query.currentPage > 1 && {
            skip: +query.skip * (+query.currentPage - 1),
          }),
          take: 10,
          include: {
            product: {
              select: {
                type: true,
                name: true,
              },
            },
          },
        });

        return res.status(200).json({
          message: 'Successfully fetched all order',
          data: {
            orders: getAllOrder,
            size: getOrderSize,
            currentPage: +query.currentPage,
            currentReturnSize: getAllOrder.length,
            totalSales: getTotalSalesAmount,
          },
        });
      }
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong, please try again' });
  }
};

export default orderApi;
