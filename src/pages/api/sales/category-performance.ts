import { prismaClient } from '@/utils/prismaClient';
import { ProductType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const productType: ProductType[] = [
  'CHEEZE_TEA',
  'GREEN_TEA_AND_LEMONADE',
  'MILK_TEA',
  'SERRADURA',
];

const categoryPerformanceApi = async (
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

      const getAllOrders = await prismaClient.order.findMany({
        where: { status: 'ACTIVE' },
      });

      const overAllSales = getAllOrders.reduce(
        (prev, { sub_total }) => prev + sub_total,
        0
      );

      const parsePerformance = productType.map((item) => {
        const category = findAllProduct.filter(
          (product) => product.type === item
        );
        return {
          name: item,
          data: category,
        };
      });

      const categoryPerformance = parsePerformance.map((item) => ({
        name: item.name,
        value: item.data
          .flatMap((_item) => _item.Order)
          .reduce((prev, { sub_total }) => prev + sub_total, 0),
        percentage: (
          (item.data
            .flatMap((_item) => _item.Order)
            .reduce((prev, { sub_total }) => prev + sub_total, 0) /
            overAllSales) *
          100
        ).toFixed(1),
      }));

      return res.status(200).json({
        message: 'Fetched Category Performance',
        data: {
          categoryPerformance,
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

export default categoryPerformanceApi;
