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
    createDashboarSalesdOrder: builder.mutation<
      BaseSuccessResponse<{
        orders: Order[];
        orderCount: number;
        totalSales: number;
        isSalesGrow: boolean;
        growPercentage: string;
        salesTarget: number;
        date: {
          type: 'Month' | 'Year' | 'Today';
          label: string;
        };
        behindDate: {
          totalSales: number;
          date: string;
        };
      }>,
      {
        type: 'Month' | 'Year' | 'Today';
        acroMonth?: number | string;
        year?: number;
        productId?: string;
        singleDay?: string;
      }
    >({
      query: (body) => ({
        url: `/dashboard/order`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    createSalesByDay: builder.mutation<
      BaseSuccessResponse<SalesMonth>,
      { start_date: string; end_date: string; productId?: string }
    >({
      query: (body) => ({
        url: `/sales/today`,
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Sale'],
    }),
    createSalesByMonth: builder.mutation<
      BaseSuccessResponse<SalesMonth>,
      { year: number; productId?: string }
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
      { start_year: number; end_year: number; productId?: string }
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
  useCreateDashboarSalesdOrderMutation,
  useCreateSalesByDayMutation,
  useCreateSalesByMonthMutation,
  useCreateSalesByYearMutation,
} = dashboardApiService;
