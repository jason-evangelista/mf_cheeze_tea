import baseApi from '@/clients/baseApi';
import { PaymentDetailsParams } from '@/components/CreateOrderPage/CreateOrderCart';
import { OrderCart } from '@/components/CreateOrderPage/CreateOrderContextProvider';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';

const createOrderApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMultipleOrders: builder.mutation<
      BaseSuccessResponse<{
        snapshotOrderCart: OrderCart[];
      }>,
      { orderCart: OrderCart[] } & PaymentDetailsParams
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
