import usePagination from '@/hooks/usePagination';
import { useGetAllOrderQuery } from '@/services/orderService';
import { Order, Product } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import DataTable from '../common/Tables/DataTable';
import Pagination from '../common/Tables/Pagination';

export type OrderTableShape = Order & {
  product: Pick<Product, 'type' | 'name'>;
};

const OrderListTable = () => {
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
      showAll: false,
      skip: numberTokip,
    });

  useEffect(() => {
    if (isSuccess) {
      handleSkip(data?.data?.size ?? 0, data?.data?.currentReturnSize ?? 0);
    }
  }, [isSuccess]);

  const columnHelper = createColumnHelper<OrderTableShape>();

  const columns = useMemo(
    () => [
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
