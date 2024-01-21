import usePagination from '@/hooks/usePagination';
import { useGetAllGroupOrderQuery } from '@/services/orderService';
import { Button, Drawer, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OrderSnapshot } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import DataTable from '../common/Tables/DataTable';
import Pagination from '../common/Tables/Pagination';
import OrderDetailsInfo from './OrderDetailsInfo';

export type OrderTableShape = OrderSnapshot;

type OrderSnapshotListTableProps = {
  searchKey: string;
};

const OrderSnapshotListTable = ({ searchKey }: OrderSnapshotListTableProps) => {
  const {
    currentPage,
    handleNextPage,
    handlePreviousPage,
    numberTokip,
    handleSkip,
  } = usePagination();

  const [opened, { open, close }] = useDisclosure(false);
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot>();

  const { data, isSuccess, isLoading, refetch, isFetching } =
    useGetAllGroupOrderQuery({
      currentPage,
      showAll: searchKey.length ? true : false,
      skip: numberTokip,
      searchKey,
    });

  useEffect(() => {
    if (isSuccess) {
      handleSkip(data?.data?.size ?? 0, data?.data?.currentReturnSize ?? 0);
    }
  }, [isSuccess]);

  const columnHelper = createColumnHelper<OrderTableShape>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('customer_name', {
        cell: (data) => data.getValue() || '-',
        header: () => <span>Customer Name</span>,
      }),
      columnHelper.accessor('payment', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Payment</span>,
      }),
      columnHelper.accessor('change', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Change</span>,
      }),
      columnHelper.accessor('total_amount', {
        cell: (data) => <PriceDisplay value={data.getValue()} />,
        header: () => <span>Total Amount</span>,
      }),
      columnHelper.accessor('order_date', {
        cell: (data) =>
          format(new Date(data.getValue()), 'dd, MMMM yyyy - hh:mm a'),
        header: () => <span>Order Date</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span>Order Details</span>,
        cell(data) {
          return (
            <>
              <Button
                onClick={() => {
                  setOrderSnapshot(data?.row?.original);
                  open();
                }}
                size="xs"
              >
                See Order
              </Button>
            </>
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
      <Drawer
        title={<Text fw="bold">Order Details</Text>}
        opened={opened}
        onClose={close}
        position="right"
        size="md"
      >
        <OrderDetailsInfo orderSnapshot={orderSnapshot} />
      </Drawer>
      <DataTable<OrderTableShape>
        columns={columns}
        isLoading={isLoading || isFetching}
        data={data?.data?.ordersSnapshot ?? []}
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

export default OrderSnapshotListTable;
