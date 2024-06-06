import { TableProps } from '@/types/TableProps';
import { prismaClient } from '@/utils/prismaClient';
import { add } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';

const groupOrderApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const query = req.query as TableProps;


      if (query.showAll === 'true') {
        const getAllOrderSnapshot = await prismaClient.orderSnapshot.findMany({
          where: {
            status: 'ACTIVE',
            ...(query.searchKey && {
              customer_name: {
                search: query.searchKey.toLowerCase().concat('*'),
              },
            }),

            ...(query.orderDate && {
              order_date: {
                gt: new Date(query.orderDate),
                lt: add(new Date(query.orderDate), { days: 1 }),
              },
            }),
          },
        });

        return res.status(200).json({
          message: 'Succesfully fetched all group orders',
          data: { ordersSnapshot: getAllOrderSnapshot },
        });
      }

      const getTotalSalesAmount = await prismaClient.order
        .findMany({
          where: { status: 'ACTIVE' },
        })
        .then((item) =>
          item.reduce((prev, { sub_total }) => prev + sub_total, 0)
        );

      // Get order for pagination
      if (query.showAll === 'false' && !req.query.id) {
        const query = req.query as TableProps;
        const getOrderSnapshotSize = await prismaClient.orderSnapshot.count({
          where: {
            status: 'ACTIVE',
          },
        });

        const getAllOrderSnapshot = await prismaClient.orderSnapshot.findMany({
          where: {
            status: 'ACTIVE',
          },
          orderBy: {
            created_at: 'desc',
          },
          ...(+query.currentPage > 1 && {
            skip: +query.skip * (+query.currentPage - 1),
          }),
          take: 10,
        });

        return res.status(200).json({
          message: 'Successfully fetched all order',
          data: {
            ordersSnapshot: getAllOrderSnapshot,
            size: getOrderSnapshotSize,
            currentPage: +query.currentPage,
            currentReturnSize: getAllOrderSnapshot.length,
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

export default groupOrderApi;
