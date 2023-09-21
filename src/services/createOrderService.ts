import baseApi from '@/clients/baseApi';
import { OrderCart } from '@/components/CreateOrderPage/CreateOrderContextProvider';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';

const createOrderApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMultipleOrders: builder.mutation<
      BaseSuccessResponse<{
        snapshotOrderCart: OrderCart[];
      }>,
      { orderCart: OrderCart[] }
    >({
      query: (body) => ({
        url: '/create-order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Multiple Order'],
    }),
  }),
});

export const { useCreateMultipleOrdersMutation } = createOrderApiService;
