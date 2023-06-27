import baseApi from '@/clients/baseApi';
import { ProductSchema } from '@/schema/schema';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { Product } from '@prisma/client';

const productApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query<
      BaseSuccessResponse<{ product: Product }>,
      string
    >({
      query: (id) => ({
        url: `/product?id=${id}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getAllProduct: builder.query<
      BaseSuccessResponse<{
        products: Product[];
        size: number;
        currentPage: number;
        currentReturnSize: number;
      }>,
      {
        currentPage: number;
        skip: number;
        showAll: boolean;
        searchKey?: string;
      }
    >({
      query: (query) => ({
        url: `/product?currentPage=${query.currentPage}&skip=${query.skip}&showAll=${query.showAll}&searchKey=${query.searchKey}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 1,
    }),
    createProduct: builder.mutation<BaseSuccessResponse, ProductSchema>({
      query: (body) => ({
        url: `/product`,
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<
      BaseSuccessResponse,
      ProductSchema & { id: string }
    >({
      query: (body) => ({
        url: `/product`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<BaseSuccessResponse, string>({
      query: (id) => ({
        url: `/product?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
} = productApiService;
