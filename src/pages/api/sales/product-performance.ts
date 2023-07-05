import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const productPerformanceApi = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (req.method === 'GET') {
      const findAllProduct = await prismaClient.product.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          Order: {
            select: {
              id: true,
              sub_total: true,
              quantity_sale: true,
              order_type_size: true,
            },
          },
        },
      });

      const productPerformance = findAllProduct.map((item) => ({
        id: item.id,
        name: item.name,
        qty_sold: item.Order.reduce(
          (prev, { quantity_sale }) => prev + quantity_sale,
          0
        ),
        over_all_sale: item.Order.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        ),
        ...(item.type !== 'SERRADURA' && {
          regular_size: item.Order.filter(
            (item) => item.order_type_size === 'Regular'
          ).length,
          large_size: item.Order.filter(
            (item) => item.order_type_size === 'Large'
          ).length,
        }),
      }));

      return res.status(200).json({
        message: 'Fetched Product Performance',
        data: { productPerformance },
      });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default productPerformanceApi;
