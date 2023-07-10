import {
  useCreateSalesByMonthMutation,
  useCreateSalesByYearMutation
} from '@/services/dashboardService';

import {
  useGetAllCategoryPerformanceQuery,
  useGetAllProductPerformanceQuery,
} from '@/services/productService';
import { Loader, Modal, Paper, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { ProductType } from '@prisma/client';
import { IconCategory2, IconGauge, IconTrendingUp } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';
import CategoryPerfGraph from '../common/Graphs/CategoryPerfGraph';
import MainSaleGraph from '../common/Graphs/MainSaleGraph';
import ProductPerfGraph from '../common/Graphs/ProductPerfGraph';
import { DashboardContext } from './DashboardContext';
import SalesSettings from './SalesSettings';

// const PRODUCT_TYPE: ProductType[] = [
//   'CHEEZE_TEA',
//   'GREEN_TEA_AND_LEMONADE',
//   'MILK_TEA',
//   'SERRADURA',
// ];

const DashboardPage = () => {
  const { salesYear, handleSetSaleYear, salesType, yearRange } =
    useContext(DashboardContext);
  const [opened, { open, close }] = useDisclosure(false);
  // const dashboardProduct = useGetAllDashboardProductQuery();
  // const dashboardOrder = useGetAllDashboardOrderQuery();
  const [createSalesMonth, salesMonthState] = useCreateSalesByMonthMutation();
  const [createSalesYear, salesYearState] = useCreateSalesByYearMutation();

  const productPerformance = useGetAllProductPerformanceQuery();
  const categoryPerformance = useGetAllCategoryPerformanceQuery();

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
      <Modal title="Sales Target" onClose={close} opened={opened}>
        <SalesSettings
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
      </Modal>
      <Tabs defaultValue="sales-report" variant="pills">
        <Paper className="p-1">
          <Tabs.List>
            <Tabs.Tab
              className="font-medium"
              value="sales-report"
              icon={<IconTrendingUp />}
            >
              Sales Report
            </Tabs.Tab>
            <Tabs.Tab
              className="font-medium"
              value="product-performance"
              icon={<IconGauge />}
            >
              Product Performance
            </Tabs.Tab>
            <Tabs.Tab
              className="font-medium"
              value="category-performance"
              icon={<IconCategory2 />}
            >
              Category Performance
            </Tabs.Tab>
          </Tabs.List>
        </Paper>
        <Tabs.Panel value="sales-report" className="py-4">
          <Paper radius="md" className="p-4">
            <MainSaleGraph
              data={salesMonthState?.data?.data || salesYearState?.data?.data}
              handleOpenSalesTarget={open}
            />
          </Paper>
        </Tabs.Panel>
        <Tabs.Panel value="product-performance" className="py-3">
          {productPerformance.isLoading || productPerformance.isFetching ? (
            <Loader />
          ) : (
            <Paper radius="md" className="p-4">
              <ProductPerfGraph
                data={productPerformance?.data?.data?.productPerformance ?? []}
              />
            </Paper>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="category-performance" className="py-3">
          {categoryPerformance.isLoading || categoryPerformance.isFetching ? (
            <Loader />
          ) : (
            <Paper radius="md" className="p-4">
              <CategoryPerfGraph
                data={
                  categoryPerformance?.data?.data?.categoryPerformance ?? []
                }
              />
            </Paper>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default DashboardPage;
