import { OrderCart } from '@/components/CreateOrderPage/CreateOrderContextProvider';
import { prismaClient } from '@/utils/prismaClient';
import { Order } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

type BodyResponse = {
  orderCart: OrderCart[];
};

type ModOrder = Omit<Order, 'created_at' | 'status' | 'id' | 'updated_at'>;

const createOrderApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { orderCart } = req.body as BodyResponse;

      const parseOrder = orderCart.reduce((prev, item) => {
        let _orderCart: ModOrder[] = [];

        if (item?.regularSizeQuantity) {
          _orderCart.push({
            base_amount: item?.orderProduct?.regular_size_amount!,
            product_id: item?.orderProduct?.id!,
            order_date: new Date(),
            sub_total:
              item?.orderProduct?.regular_size_amount! *
              item?.regularSizeQuantity,
            quantity_sale: item?.regularSizeQuantity,
            order_type_size: 'Regular',
          });
        }

        if (item.largeSizeQuantity) {
          _orderCart.push({
            base_amount: item?.orderProduct?.large_size_amount!,
            product_id: item?.orderProduct?.id!,
            order_date: new Date(),
            sub_total:
              item?.orderProduct?.large_size_amount! * item?.largeSizeQuantity,
            quantity_sale: item?.largeSizeQuantity,
            order_type_size: 'Large',
          });
        }

        if (item.fixedPriceQuantity) {
          _orderCart.push({
            base_amount: item?.orderProduct?.fixed_amount!,
            product_id: item?.orderProduct?.id!,
            order_date: new Date(),
            sub_total:
              item?.orderProduct?.fixed_amount! * item?.fixedPriceQuantity,
            quantity_sale: item?.fixedPriceQuantity,
            order_type_size: 'Fixed',
          });
        }

        return [...prev, ..._orderCart];
      }, [] as ModOrder[]);

      const createManyOrder = await prismaClient.order.createMany({
        data: parseOrder,
      });

      if (createManyOrder)
        return res.status(200).json({ message: 'Order complete!' });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'Something went wrong, please try again' });
  }
};

export default createOrderApi;
