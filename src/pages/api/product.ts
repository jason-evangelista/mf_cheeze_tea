import { ProductSchema } from '@/schema/schema';
import { TableProps } from '@/types/TableProps';
import { prismaClient } from '@/utils/prismaClient';
import { ProductType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const productApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Create Product
    if (req.method === 'POST') {
      const body = req.body as ProductSchema;

      const findProduct = await prismaClient.product.findUnique({
        where: {
          name: body?.product_name,
        },
      });

      if (findProduct)
        return res.status(400).json({ message: 'Product already exist' });

      const saveProduct = await prismaClient.product.create({
        data: {
          name: body?.product_name,
          type: body?.product_type as ProductType,
          large_size_amount: body?.large_size_amount,
          regular_size_amount: body?.regular_size_amount,
          fixed_amount: body?.fixed_amount ?? null,
        },
      });

      if (saveProduct)
        return res.status(200).json({ message: 'Product successfully added' });
    }

    // Get All Product
    if (req.method === 'GET') {
      const body = req.query as TableProps;

      const getProductSize = await prismaClient.product.count();
      const getAllProduct = await prismaClient.product.findMany({
        orderBy: {
          created_at: 'desc',
        },
        ...(+body.currentPage > 1 && {
          skip: +body.skip * (+body.currentPage - 1),
        }),
        take: 10,
      });

      return res.status(200).json({
        message: 'Successfully fetched all product',
        data: {
          products: getAllProduct,
          size: getProductSize,
          currentPage: +body.currentPage,
          currentReturnSize: getAllProduct.length,
        },
      });
    }

    // Update Product
    if (req.method === 'PUT') {
      const body = req.body as ProductSchema & { id: string };

      const findProduct = await prismaClient.product.findUnique({
        where: {
          name: body?.product_name,
        },
      });

      if (findProduct)
        return res.status(400).json({ message: 'Product name already exist' });

      const updateProduct = await prismaClient.product.update({
        where: {
          id: body?.id,
        },
        data: {
          name: body?.product_name,
          fixed_amount: body?.fixed_amount,
          large_size_amount: body?.large_size_amount,
          regular_size_amount: body?.regular_size_amount,
          type: body?.product_type as ProductType,
        },
      });

      if (updateProduct)
        return res.status(200).json({ message: 'Product successfully update' });
    }

    // Delete Product
    if (req.method === 'DELETE') {
      const query = req.query as { id: string };
      const findProduct = await prismaClient.product.findUnique({
        where: {
          id: query?.id,
        },
      });

      if (!findProduct)
        return res.status(400).json({ message: "Product doesn't exist" });

      const deleteProduct = await prismaClient.product.delete({
        where: {
          id: query.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (deleteProduct)
        return res
          .status(200)
          .json({ message: 'Product successfully deleted' });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default productApi;
