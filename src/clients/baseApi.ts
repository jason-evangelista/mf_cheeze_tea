import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVICE_API,
  prepareHeaders: (headers) => {
    const token = Cookies.get('mfcheezetea_session');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 403) {
      throw new Error('Error 403');
    }
  }

  return result;
};

const tagTypes: string[] = ['User'];

const baseApi = createApi({
  reducerPath: 'crmApi',
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  tagTypes,
});

export default baseApi;
