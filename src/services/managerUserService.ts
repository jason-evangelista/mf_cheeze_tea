import baseApi from '@/clients/baseApi';
import { UserFormCredProps } from '@/components/ManageUserPage/ManageUserPage';
import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { Account } from '@prisma/client';

const manageUserService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query<
      BaseSuccessResponse<{
        users: Account[];
      }>,
      void
    >({
      query: () => ({
        url: '/manage-user/all-users',
      }),
      keepUnusedDataFor: 1,
      providesTags: ['Manage User'],
    }),
    createUser: builder.mutation<BaseSuccessResponse, UserFormCredProps>({
      query: (body) => ({
        url: '/manage-user/add',
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Manage User'],
    }),
    updateUser: builder.mutation<
      BaseSuccessResponse,
      UserFormCredProps & { id: string }
    >({
      query: (body) => ({
        url: '/manage-user/update',
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Manage User'],
    }),
    requestPasswordReset: builder.mutation<
      BaseSuccessResponse,
      { email: string }
    >({
      query: (body) => ({
        url: '/manage-user/request-reset-password',
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Manage User'],
    }),
    checkResetPasswordId: builder.query<
      BaseSuccessResponse<{
        user: Pick<Account, 'id' | 'email' | 'username' | 'reset_id'>;
      }>,
      { email: string }
    >({
      query: ({ email }) => ({
        url: `/manage-user/reset-password?email=${email}`,
        method: 'GET',
      }),
      providesTags: ['Manage User'],
      keepUnusedDataFor: 1,
    }),
    resetPassword: builder.mutation<
      BaseSuccessResponse,
      { email: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/manage-user/reset-password',
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Manage User'],
    }),
    deleteUser: builder.mutation<BaseSuccessResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/manage-user/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Manage User'],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useRequestPasswordResetMutation,
  useCheckResetPasswordIdQuery,
  useResetPasswordMutation,
  useDeleteUserMutation,
} = manageUserService;
