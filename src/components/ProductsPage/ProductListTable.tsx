import { mapProductType } from '@/constants/productType';
import usePagination from '@/hooks/usePagination';
import { ProductSchema } from '@/schema/schema';
import {
  useDeleteProductMutation,
  useGetAllProductQuery,
} from '@/services/productService';
import { Product } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Image,
  Popover,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPhotoSearch, IconTrash } from '@tabler/icons-react';
import DeleteModal from '../common/DeleteModal';
import PriceDisplay from '../common/PriceDisplay';
import DataTable from '../common/Tables/DataTable';
import Pagination from '../common/Tables/Pagination';

export type ProductListTableProps = {
  handleGetProductInfo: (
    // eslint-disable-next-line no-unused-vars
    payload: ProductSchema & { id: string; product_photo?: string }
  ) => void;
  searchKey: string;
};
type ProductDataTableShape = Product;

const ProductListTable = ({
  handleGetProductInfo,
  searchKey,
}: ProductListTableProps) => {
  const theme = useMantineTheme();

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
      showAll: searchKey.length ? true : false,
      searchKey,
    });

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (isSuccess) {
      handleSkip(data?.data?.size ?? 0, data?.data?.currentReturnSize ?? 0);
    }
  }, [isSuccess]);

  const columnHelper = createColumnHelper<ProductDataTableShape>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('photo', {
        header: () => <span>Product Preview</span>,
        cell: (data) => {
          return (
            <>
              {data.getValue() ? (
                <Popover width={200} position="right" withArrow>
                  <Popover.Target>
                    <Tooltip
                      label="Click photo to see preview"
                      position="bottom"
                      withArrow
                      sx={{ fontSize: 12 }}
                    >
                      <Image
                        width={60}
                        height={60}
                        alt={data.row.original.name}
                        src={data.getValue()}
                        fit="cover"
                        sx={{
                          borderRadius: 8,
                          border: `1px solid ${theme.colors.gray[3]}`,
                          overflow: 'hidden',
                        }}
                      />
                    </Tooltip>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Image
                      alt={data.row.original.name}
                      src={data.getValue()}
                      fit="contain"
                      sx={{
                        borderRadius: 8,
                        border: `1px solid ${theme.colors.gray[3]}`,
                        overflow: 'hidden',
                      }}
                    />
                  </Popover.Dropdown>
                </Popover>
              ) : (
                <IconPhotoSearch size={35} color="gray" stroke={1.2} />
              )}
            </>
          );
        },
      }),
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
                size="xs"
                onClick={() => {
                  const {
                    fixed_amount,
                    large_size_amount,
                    name,
                    regular_size_amount,
                    type,
                    id,
                    photo,
                  } = data.row.original;
                  handleGetProductInfo({
                    product_name: name,
                    product_type: type,
                    fixed_amount: fixed_amount ?? 0,
                    large_size_amount: large_size_amount ?? 0,
                    regular_size_amount: regular_size_amount ?? 0,
                    product_photo: photo ?? '',
                    id,
                  });
                }}
                color="green"
                leftIcon={<IconEdit size={18} />}
              >
                Update
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  setProductDelete({
                    id: data.row.original.id,
                    name: data.row.original.name,
                  });
                  open();
                }}
                color="red"
                leftIcon={<IconTrash size={18} />}
              >
                Delete
              </Button>
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
        onClose={close}
        opened={opened}
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
