import baseApi from '@/clients/baseApi';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { SalesMonth, SalesYear } from '@/types/Sales';
import { Order, Product } from '@prisma/client';

const dashboardApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDashboardProduct: builder.query<
      BaseSuccessResponse<{ products: Product[]; productCount: number }>,
      void
    >({
      query: () => `/dashboard/product`,
      providesTags: ['Product'],
    }),
    getAllDashboardOrder: builder.query<
      BaseSuccessResponse<{
        orders: Order[];
        orderCount: number;
        totalSales: number;
      }>,
      void
    >({
      query: () => `/dashboard/order`,
      providesTags: ['Order'],
    }),
    createSalesByMonth: builder.mutation<
      BaseSuccessResponse<SalesMonth>,
      { year: number }
    >({
      query: (body) => ({
        url: `/sales/month`,
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Sale'],
    }),
    createSalesByYear: builder.mutation<
      BaseSuccessResponse<SalesYear>,
      { start_year: number; end_year: number }
    >({
      query: (body) => ({
        url: `/sales/year`,
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Sale'],
    }),
  }),
});

export const {
  useGetAllDashboardProductQuery,
  useGetAllDashboardOrderQuery,
  useCreateSalesByMonthMutation,
  useCreateSalesByYearMutation,
} = dashboardApiService;
