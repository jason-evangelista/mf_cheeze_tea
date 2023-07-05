import {
  useCreateSalesByMonthMutation,
  useCreateSalesByYearMutation,
  useGetAllDashboardOrderQuery,
  useGetAllDashboardProductQuery,
} from '@/services/dashboardService';
import Card from '../common/Card';

import useToggleContainer from '@/hooks/useToggleContainer';
import {
  useGetAllCategoryPerformanceQuery,
  useGetAllProductPerformanceQuery,
} from '@/services/productService';
import { ProductType } from '@prisma/client';
import { IconFilter, IconSettings } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';
import CategoryPerfGraph from '../common/Graphs/CategoryPerfGraph';
import MainSaleGraph from '../common/Graphs/MainSaleGraph';
import ProductPerfGraph from '../common/Graphs/ProductPerfGraph';
import Loading from '../common/Loading';
import PriceDisplay from '../common/PriceDisplay';
import { DashboardContext } from './DashboardContext';
import SalesFilter from './SalesFilter';
import SalesSettings from './SalesSettings';

const PRODUCT_TYPE: ProductType[] = [
  'CHEEZE_TEA',
  'GREEN_TEA_AND_LEMONADE',
  'MILK_TEA',
  'SERRADURA',
];

const DashboardPage = () => {
  const { salesYear, handleSetSaleYear, salesType, yearRange } =
    useContext(DashboardContext);
  const dashboardProduct = useGetAllDashboardProductQuery();
  const dashboardOrder = useGetAllDashboardOrderQuery();
  const [createSalesMonth, salesMonthState] = useCreateSalesByMonthMutation();
  const [createSalesYear, salesYearState] = useCreateSalesByYearMutation();

  const productPerformance = useGetAllProductPerformanceQuery();
  const categoryPerformance = useGetAllCategoryPerformanceQuery();

  const { handleToggle, isOpen, handleClose } = useToggleContainer();
  const modalToggle = useToggleContainer();

  useEffect(() => {
    if (typeof handleSetSaleYear === 'function')
      handleSetSaleYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!salesYear) return;
    if (salesType === 'Month') {
      salesYearState.reset();
      createSalesMonth({ year: salesYear });
    }
  }, [salesYear, salesType]);

  useEffect(() => {
    if (salesType === 'Year' && yearRange) {
      salesMonthState.reset();
      createSalesYear(yearRange);
    }
  }, [salesType, yearRange]);

  return (
    <>
      <SalesSettings
        handleClose={modalToggle.handleClose}
        isOpen={modalToggle.isOpen}
        refetchReport={() => {
          if (salesType === 'Month') {
            salesYearState.reset();
            createSalesMonth({ year: salesYear ?? 0 });
          }

          if (salesType === 'Year' && yearRange) {
            salesMonthState.reset();
            createSalesYear(yearRange);
          }
        }}
      />
      <div className="w-full pb-8">
        <div className="flex items-stretch justify-end gap-4 mx-auto mb-3 pr-7">
          <Card>
            <h1>Total Products</h1>
            {dashboardProduct.isLoading ? (
              <Loading label="" />
            ) : (
              <h5 className="font-semibold">
                {dashboardProduct?.data?.data?.productCount}
              </h5>
            )}
          </Card>
          <Card>
            <h1>Total orders</h1>
            {dashboardOrder.isLoading ? (
              <Loading label="" />
            ) : (
              <h5 className="font-semibold">
                {dashboardOrder?.data?.data?.orderCount}
              </h5>
            )}
          </Card>
          <Card>
            <h1>Total Category</h1>
            <h5 className="font-semibold">{PRODUCT_TYPE.length}</h5>
          </Card>
          <Card>
            <h1>Total Sales</h1>
            <PriceDisplay value={dashboardOrder?.data?.data?.totalSales} />
          </Card>
          <div className="flex justify-end items-center gap-2">
            <div
              onClick={handleToggle}
              className="!text-black relative cursor-pointer"
            >
              <IconFilter size={28} />
              <SalesFilter handleClose={handleClose} isOpen={isOpen} />
            </div>
            <div
              onClick={modalToggle.handleToggle}
              className="!text-black relative cursor-pointer"
            >
              <IconSettings size={28} />
            </div>
          </div>
        </div>
        {salesMonthState.isLoading || salesYearState.isLoading ? (
          <Loading label="Fetching Reports..." />
        ) : (
          <MainSaleGraph
            data={salesMonthState?.data?.data || salesYearState?.data?.data}
          />
        )}
        <div className="border my-4" />
        {productPerformance.isLoading || productPerformance.isFetching ? (
          <Loading label="Fetching Product Performance" />
        ) : (
          <ProductPerfGraph
            data={productPerformance?.data?.data?.productPerformance ?? []}
          />
        )}
        <div className="border my-4" />
        {categoryPerformance.isLoading || categoryPerformance.isFetching ? (
          <Loading label="Fetching Category Performance" />
        ) : (
          <CategoryPerfGraph
            data={categoryPerformance?.data?.data?.categoryPerformance ?? []}
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
