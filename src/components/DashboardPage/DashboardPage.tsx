import {
  useCreateDashboarSalesdOrderMutation,
  useCreateSalesByMonthMutation,
  useCreateSalesByYearMutation,
  useGetAllDashboardProductQuery,
} from '@/services/dashboardService';

import {
  useGetAllCategoryPerformanceQuery,
  useGetAllProductPerformanceQuery,
} from '@/services/productService';
import {
  Badge,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Paper,
  ScrollArea,
  Tabs,
  Text,
  Timeline,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Order } from '@prisma/client';
import { IconCategory2, IconGauge, IconTrendingUp } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo } from 'react';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';
import CategoryPerfGraph from '../common/Graphs/CategoryPerfGraph';
import MainSaleGraph from '../common/Graphs/MainSaleGraph';
import ProductPerfGraph from '../common/Graphs/ProductPerfGraph';
import PriceDisplay from '../common/PriceDisplay';
import { DashboardContext } from './DashboardContext';
import SalesSettings from './SalesSettings';

const DashboardPage = () => {
  const router = useRouter();
  const { colors } = useMantineTheme();
  const {
    salesYear,
    handleSetSaleYear,
    salesType,
    yearRange,
    productId,
    dashboardOrdersMonth,
  } = useContext(DashboardContext);
  const [opened, { open, close }] = useDisclosure(false);

  const dashboardProduct = useGetAllDashboardProductQuery();
  const [createDashboardOrderSR, dashboardOrderState] =
    useCreateDashboarSalesdOrderMutation();

  const [createSalesMonth, salesMonthState] = useCreateSalesByMonthMutation();
  const [createSalesYear, salesYearState] = useCreateSalesByYearMutation();

  const productPerformance = useGetAllProductPerformanceQuery();
  const categoryPerformance = useGetAllCategoryPerformanceQuery();

  const handleLineClick = async (e: CategoricalChartState) => {
    // if (e?.activeLabel && !isNaN(Number(e.activeLabel))) {
    // }
    if (e?.activeLabel && typeof e.activeLabel === 'string') {
      router.replace({
        pathname: router.pathname,
        query: {
          v: e?.activeLabel,
        },
      });
      createDashboardOrderSR({
        acroMonth: e.activeLabel,
        type: 'Month',
        year: dashboardOrdersMonth?.year ?? 0,
        productId: dashboardOrdersMonth?.productId,
      });
    }
  };

  const memoBestSellingProduct = useMemo(() => {
    if (!dashboardOrderState?.data?.data?.orders?.length) return [];
    return structuredClone(
      dashboardOrderState?.data?.data?.orders ?? []
    ).reduce((acc, { product_id }) => {
      const findProduct = dashboardProduct?.data?.data?.products.find(
        (product) => product.id.match(product_id)
      );

      return (
        // @ts-ignore
        acc[findProduct?.name]
          ? //@ts-ignore
            (acc[findProduct?.name] = {
              //@ts-ignore
              count: acc[findProduct?.name].count + 1,
              totalSales: dashboardOrderState?.data?.data?.orders.filter(
                (order) => order.product_id.match(product_id)
              ),
            })
          : //@ts-ignore
            (acc[findProduct?.name] = {
              count: 1,
              totalSales: dashboardOrderState?.data?.data?.orders.filter(
                (order) => order.product_id.match(product_id)
              ),
            }),
        acc
      );
    }, {});
  }, [
    dashboardOrderState?.data?.data?.orders,
    dashboardProduct?.data?.data?.products,
  ]);

  useEffect(() => {
    if (typeof handleSetSaleYear === 'function')
      handleSetSaleYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!salesYear) return;
    if (salesType === 'Month') {
      salesYearState.reset();
      createSalesMonth({ year: salesYear, productId: productId?.month });
      createDashboardOrderSR({
        acroMonth: new Date().getMonth(),
        type: 'Month',
        year: new Date().getFullYear(),
      });
    }
  }, [salesYear, salesType, productId?.month]);

  useEffect(() => {
    if (salesType === 'Year' && yearRange) {
      salesMonthState.reset();
      createSalesYear(yearRange);
    }
  }, [salesType, yearRange]);

  useEffect(() => {
    if (!dashboardOrdersMonth) return;
    if (salesType === 'Month') {
      createDashboardOrderSR({
        acroMonth: (router?.query?.v as string) ?? '',
        type: 'Month',
        year: salesYear ?? 0,
        productId: dashboardOrdersMonth?.productId,
      });
    }
  }, [
    dashboardOrdersMonth?.productId,
    dashboardOrdersMonth?.year,
    salesType,
    router?.query?.v,
    salesYear,
  ]);

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
        <Tabs.Panel value="sales-report" className="py-4 relative w-full">
          <Group grow align="start">
            <Paper radius="md" className="p-4">
              <MainSaleGraph
                data={salesMonthState?.data?.data || salesYearState?.data?.data}
                handleOpenSalesTarget={open}
                loading={salesMonthState.isLoading || salesYearState.isLoading}
                handleLineClick={handleLineClick}
              />
            </Paper>
            <Group grow align="start">
              <Paper radius="md" shadow="sm" className="p-3" pos="relative">
                <LoadingOverlay visible={dashboardOrderState.isLoading} />
                <Title order={4} color={colors.gray[8]}>
                  Overall
                </Title>
                <Divider
                  label={
                    <Badge variant="filled">
                      {dashboardOrderState?.data?.data?.date.label}
                    </Badge>
                  }
                  className="my-2"
                />
                <div aria-label="Total Sales">
                  <Badge variant="dot">Total Sales</Badge>
                  <Title order={2}>
                    <PriceDisplay
                      value={dashboardOrderState?.data?.data?.totalSales}
                      fallback={
                        <span className="text-base text-gray-500">
                          No Current Sales
                        </span>
                      }
                    />
                  </Title>
                </div>
                <Divider className="my-2" />
                <div aria-label="Total Orders">
                  <Badge variant="dot">Total Orders</Badge>
                  <Title order={2}>
                    {dashboardOrderState?.data?.data?.orderCount || (
                      <span className="text-base text-gray-500">
                        No Current Orders
                      </span>
                    )}
                  </Title>
                </div>
              </Paper>
              <Paper
                aria-label="Best Selling Products"
                radius="md"
                shadow="sm"
                className="p-4"
                pos="relative"
              >
                <LoadingOverlay visible={dashboardOrderState.isLoading} />
                <Title order={4} color={colors.gray[8]}>
                  Best Selling Product
                </Title>
                <Divider
                  label={
                    <Badge variant="filled">
                      {dashboardOrderState?.data?.data?.date.label}
                    </Badge>
                  }
                  className="mb-4"
                />
                <ScrollArea.Autosize mah={400} p={4} offsetScrollbars>
                  <div className="p-2">
                    <Timeline
                      bulletSize={18}
                      lineWidth={1}
                      active={999}
                      color="blue"
                    >
                      {Object.entries(memoBestSellingProduct)
                        .filter((item) => item[0] !== 'undefined')
                        .sort(
                          (a, b) => (b[1] as any).count - (a[1] as any).count
                        )
                        .map((item) => (
                          <Timeline.Item
                            className="text-sm"
                            key={item[0]}
                            title={<span className="font-bold">{item[0]}</span>}
                            bulletSize={20}
                          >
                            <Text>
                              Frequency:&nbsp;{(item[1] as any).count}
                            </Text>
                            <Text className="font-medium">
                              Qty Sold:&nbsp;
                              {(
                                item[1] as { totalSales: Order[] }
                              ).totalSales?.reduce(
                                (prev, { quantity_sale }) =>
                                  prev + quantity_sale,
                                0
                              )}
                            </Text>
                            <Text className="font-medium flex items-center gap-1">
                              Sales:&nbsp;
                              <PriceDisplay
                                value={(
                                  item[1] as { totalSales: Order[] }
                                ).totalSales?.reduce(
                                  (prev, { sub_total }) => prev + sub_total,
                                  0
                                )}
                              />
                              <Badge className="align-middlegn">
                                {(
                                  ((
                                    item[1] as { totalSales: Order[] }
                                  ).totalSales?.reduce(
                                    (prev, { sub_total }) => prev + sub_total,
                                    0
                                  ) /
                                    dashboardOrderState?.data?.data
                                      ?.totalSales!) *
                                  100
                                ).toFixed(1)}
                                %
                              </Badge>
                            </Text>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                    {!Object.entries(memoBestSellingProduct).length && (
                      <Title order={2}>
                        {dashboardOrderState?.data?.data?.orderCount || (
                          <span className="text-base text-gray-500">
                            No Current Sales
                          </span>
                        )}
                      </Title>
                    )}
                  </div>
                </ScrollArea.Autosize>
              </Paper>
            </Group>
          </Group>
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
