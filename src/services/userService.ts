import baseApi from '@/clients/baseApi';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';

const userApiService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      BaseSuccessResponse<{ id: string; token: string }>,
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: `/user?type=sign-in`,
        body: credentials,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    createUser: builder.mutation<
      { message: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: `/user?type=sign-up`,
        body: credentials,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginUserMutation, useCreateUserMutation } = userApiService;
