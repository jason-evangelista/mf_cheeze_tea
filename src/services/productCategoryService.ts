import baseApi from "@/clients/baseApi";
import { BaseSuccessResponse } from "@/types/BaseApiResponse";
import { ProductCategory } from "@prisma/client";

const productCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductCategory: builder.query<BaseSuccessResponse<{ productCategory: ProductCategory[] }>, void>({
      query: () => `/category`,
      providesTags: ['Product Category']
    })
  })
})

export const { useGetAllProductCategoryQuery } = productCategoryApi
