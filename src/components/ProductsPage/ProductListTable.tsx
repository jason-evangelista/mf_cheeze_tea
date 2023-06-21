import { mapProductType } from '@/constants/productType';
import usePagination from '@/hooks/usePagination';
import useToggleContainer from '@/hooks/useToggleContainer';
import { ProductSchema } from '@/schema/schema';
import {
  useDeleteProductMutation,
  useGetAllProductQuery,
} from '@/services/productService';
import { Product } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button';
import DeleteModal from '../common/DeleteModal';
import PriceDisplay from '../common/PriceDisplay';
import DataTable from '../common/Tables/DataTable';
import Pagination from '../common/Tables/Pagination';

export type ProductListTableProps = {
  // eslint-disable-next-line no-unused-vars
  handleGetProductInfo: (payload: ProductSchema & { id: string }) => void;
};
type ProductDataTableShape = Product;

const ProductListTable = ({ handleGetProductInfo }: ProductListTableProps) => {
  const {
    currentPage,
    handleNextPage,
    handlePreviousPage,
    numberTokip,
    handleSkip,
  } = usePagination();
  const [productDelete, setProductDelete] =
    useState<Pick<Product, 'id' | 'name'>>();
  const { data, isLoading, isFetching, refetch, isSuccess } =
    useGetAllProductQuery({
      currentPage,
      skip: numberTokip,
    });

  const { isOpen, handleToggle, handleClose } = useToggleContainer();

  useEffect(() => {
    if (isSuccess) {
      handleSkip(data?.data?.size ?? 0, data?.data?.currentReturnSize ?? 0);
    }
  }, [isSuccess]);

  const columnHelper = createColumnHelper<ProductDataTableShape>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        cell: (data) => data.getValue(),
        header: () => <span>Product Name</span>,
      }),
      columnHelper.accessor('type', {
        cell: (data) => mapProductType(data.getValue()),
        header: () => <span>Product Type</span>,
      }),
      columnHelper.accessor('fixed_amount', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Fixed Amount</span>,
      }),
      columnHelper.accessor('large_size_amount', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Large Sz. Amount</span>,
      }),
      columnHelper.accessor('regular_size_amount', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Regular Sz. Amount</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span>Actions</span>,
        cell(data) {
          return (
            <div className="flex items-center gap-2">
              <Button
                btnTitle="Update"
                className="bg-green-600 text-xs p-[5px]"
                onClick={() => {
                  const {
                    fixed_amount,
                    large_size_amount,
                    name,
                    regular_size_amount,
                    type,
                    id,
                  } = data.row.original;
                  handleGetProductInfo({
                    product_name: name,
                    product_type: type,
                    fixed_amount: fixed_amount ?? 0,
                    large_size_amount: large_size_amount ?? 0,
                    regular_size_amount: regular_size_amount ?? 0,
                    id,
                  });
                }}
              />
              <Button
                btnTitle="Delete"
                className="bg-red-600 text-xs p-[5px]"
                onClick={() => {
                  setProductDelete({
                    id: data.row.original.id,
                    name: data.row.original.name,
                  });
                  handleToggle();
                }}
              />
            </div>
          );
        },
      }),
    ],
    []
  );

  useEffect(() => {
    if (!data?.data?.size) return;
  }, [data?.data]);

  return (
    <div>
      <DeleteModal
        isOpen={isOpen}
        handleToggle={handleToggle}
        deleteQuery={useDeleteProductMutation}
        message={
          <span>
            Are you sure you want to delete&nbsp;
            <span className="font-semibold">{productDelete?.name}?</span>
          </span>
        }
        params={{
          id: productDelete?.id,
        }}
        handleClose={handleClose}
      />
      <DataTable<ProductDataTableShape>
        columns={columns}
        isLoading={isLoading || isFetching}
        data={data?.data?.products}
      />
      <Pagination
        isLoading={isLoading || isFetching}
        returnCurrentSize={data?.data?.currentReturnSize ?? 0}
        refetch={refetch}
        handleBack={handlePreviousPage}
        handleNext={handleNextPage}
        overAllSize={data?.data?.size ?? 0}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductListTable;
