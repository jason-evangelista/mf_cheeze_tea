import baseApi from '@/clients/baseApi';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { SalesTargetBody } from '@/types/SalesTarget';

const salesTargetService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSalesTarget: builder.mutation<
      BaseSuccessResponse<{}>,
      SalesTargetBody
    >({
      query: (body) => ({
        url: `/sales/sales-target`,
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Sales Target', 'Sale'],
    }),
  }),
});

export const { useCreateSalesTargetMutation } = salesTargetService;
