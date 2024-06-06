import baseApi from '@/clients/baseApi';
import { OrderTableShape } from '@/components/OrderPage/OrderListTable';
import { OrderSchema } from '@/schema/schema';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { OrderSnapshot } from '@prisma/client';

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
        orderDate: string;
      }
    >({
      query: (query) => ({
        url: `/order?${new URLSearchParams(
          query as unknown as Record<string, string>
        )}`,
      }),
      keepUnusedDataFor: 1,
      providesTags: ['Order'],
    }),
    getAllGroupOrder: builder.query<
      BaseSuccessResponse<{
        ordersSnapshot: OrderSnapshot[];
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
        orderDate: string;
      }
    >({
      query: (query) => ({
        url: `/group-order?${new URLSearchParams(
          query as unknown as Record<string, string>
        )}`,
      }),
      keepUnusedDataFor: 1,
      providesTags: ['Group Order', 'Order'],
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

export const {
  useCreateOrderMutation,
  useGetAllOrderQuery,
  useGetAllGroupOrderQuery,
} = orderApiService;
