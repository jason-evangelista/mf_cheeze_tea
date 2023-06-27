import baseApi from '@/clients/baseApi';
import { OrderTableShape } from '@/components/OrderPage/OrderListTable';
import { OrderSchema } from '@/schema/schema';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';

const orderApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrder: builder.query<
      BaseSuccessResponse<{
        orders: OrderTableShape[];
        size: number;
        currentPage: number;
        currentReturnSize: number;
        totalSales: number;
      }>,
      {
        currentPage: number;
        skip: number;
        showAll: boolean;
        searchKey?: string;
      }
    >({
      query: (query) => ({
        url: `/order?currentPage=${query.currentPage}&skip=${query.skip}&showAll=${query.showAll}&searchKey=${query.searchKey}`,
      }),
      keepUnusedDataFor: 1,
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<BaseSuccessResponse, OrderSchema>({
      query: (body) => ({
        url: `/order`,
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrderQuery } = orderApiService;
