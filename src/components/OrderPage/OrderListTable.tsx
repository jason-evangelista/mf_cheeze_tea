import usePagination from '@/hooks/usePagination';
import { useGetAllOrderQuery } from '@/services/orderService';
import { Image, Popover, Tooltip, useMantineTheme } from '@mantine/core';
import { Order, Product } from '@prisma/client';
import { IconPhotoSearch } from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import DataTable from '../common/Tables/DataTable';
import Pagination from '../common/Tables/Pagination';

export type OrderTableShape = Order & {
  product: Pick<Product, 'type' | 'name' | 'photo'>;
};

type OrderListTableProps = {
  searchKey: string;
  orderDate: string;
};

const OrderListTable = ({ searchKey, orderDate }: OrderListTableProps) => {
  const theme = useMantineTheme();
  const {
    currentPage,
    handleNextPage,
    handlePreviousPage,
    numberTokip,
    handleSkip,
  } = usePagination();

  const { data, isSuccess, isLoading, refetch, isFetching } =
    useGetAllOrderQuery({
      currentPage,
      showAll: orderDate.length || searchKey.length ? true : false,
      skip: numberTokip,
      searchKey,
      orderDate,
    });

  useEffect(() => {
    if (isSuccess) {
      handleSkip(data?.data?.size ?? 0, data?.data?.currentReturnSize ?? 0);
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log({ searchKey });
  }, [searchKey]);

  const columnHelper = createColumnHelper<OrderTableShape>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('product.photo', {
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
                        alt={data.row.original.product.photo ?? ''}
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
                      alt={data.row.original.product.photo ?? ''}
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
      columnHelper.accessor('product.name', {
        cell: (data) => data.getValue(),
        header: () => <span>Product Name</span>,
      }),
      columnHelper.accessor('quantity_sale', {
        cell: (data) => data.getValue(),
        header: () => <span>Qty Sold</span>,
      }),
      columnHelper.accessor('order_type_size', {
        cell: (data) => data.getValue(),
        header: () => <span>Order Type/Size</span>,
      }),
      columnHelper.accessor('base_amount', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Base Amount</span>,
      }),
      columnHelper.accessor('sub_total', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Total Amount</span>,
      }),
      columnHelper.accessor('order_date', {
        cell: (data) => format(new Date(data.getValue()), 'dd, MMMM yyyy'),
        header: () => <span>Order Date</span>,
      }),
    ],
    []
  );

  useEffect(() => {
    if (!data?.data?.size) return;
  }, [data?.data]);

  return (
    <div>
      <DataTable<OrderTableShape>
        columns={columns}
        isLoading={isLoading || isFetching}
        data={data?.data?.orders}
      />
      <div className="flex items-center justify-between">
        <Pagination
          isLoading={isLoading || isFetching}
          returnCurrentSize={data?.data?.currentReturnSize ?? 0}
          refetch={refetch}
          handleBack={handlePreviousPage}
          handleNext={handleNextPage}
          overAllSize={data?.data?.size ?? 0}
          currentPage={currentPage}
        />
        <div className="flex items-center">
          <h3 className="font-medium">Total Sales:</h3>&nbsp;
          <span className="font-semibold">
            <PriceDisplay value={data?.data?.totalSales} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderListTable;
