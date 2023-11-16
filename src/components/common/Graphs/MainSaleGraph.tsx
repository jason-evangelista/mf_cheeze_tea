import CollapseSalesFilter from '@/components/DashboardPage/CollapseSalesFilter';
import { DashboardContext } from '@/components/DashboardPage/DashboardContext';
import { useGetAllProductQuery } from '@/services/productService';
import { SalesMonth, SalesYear } from '@/types/Sales';
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAdjustmentsAlt,
  IconChartLine,
  IconReportAnalytics,
} from '@tabler/icons-react';
import { memo, useContext, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

export type MainSaleGraphProps = {
  data?: SalesMonth | SalesYear;
  handleOpenSalesTarget: VoidFunction;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  handleLineClick: (e: CategoricalChartState) => void;
};

const domain = {
  Month: [0, 20000],
  Year: [0, 100000],
  Today: [0, 5000],
  tickMonth: 10,
  tickYear: 15,
};

const MainSaleGraph = ({
  data,
  loading,
  handleOpenSalesTarget,
  handleLineClick,
}: MainSaleGraphProps) => {
  const { colors } = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const { salesType } = useContext(DashboardContext);
  const [chart, setChart] = useState<'Line' | 'Bar' | 'Line Filled'>('Line');

  const isDay = salesType === 'Today';

  const { isLoading, data: productData } = useGetAllProductQuery({
    currentPage: 0,
    showAll: true,
    skip: 0,
    searchKey: undefined,
  });

  const memoData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).flatMap((item) => ({
      ...item[1],
      name: item[1].label,
    }));
  }, [data, salesType]);

  console.log({ data });

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Group className="gap-2 my-4">
        <Button onClick={toggle} leftIcon={<IconAdjustmentsAlt />} size="xs">
          Filter Data
        </Button>
        <Button
          onClick={handleOpenSalesTarget}
          leftIcon={<IconReportAnalytics />}
          size="xs"
        >
          Sales Target
        </Button>
        <Select
          defaultValue={chart}
          data={['Line', 'Bar', 'Line Filled']}
          size="xs"
          icon={<IconChartLine />}
          onChange={(e) => setChart(e as 'Line' | 'Bar' | 'Line Filled')}
        />
      </Group>
      <Box>
        <CollapseSalesFilter
          opened={opened}
          isLoading={isLoading}
          products={productData?.data?.products ?? []}
        />
      </Box>
      <div className="relative">
        <LoadingOverlay visible={loading} zIndex={1} />
        {chart === 'Line' && (
          <ResponsiveContainer
            width="100%"
            height={300}
            className="text-[11px] cursor-pointer"
          >
            {memoData.length ? (
              <LineChart
                data={memoData}
                margin={{
                  top: 10,
                  right: 30,
                }}
                onClick={handleLineClick}
                style={{
                  cursor: 'pointer',
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey="actual_sales"
                  domain={domain[salesType!]}
                  tickCount={
                    salesType === 'Month' ? domain.tickMonth : domain.tickYear
                  }
                />
                <Tooltip />
                <Legend
                  margin={{ bottom: 10 }}
                  iconSize={20}
                  iconType="square"
                  fontSize={24}
                  fontWeight={800}
                  wrapperStyle={{
                    fontWeight: 600,
                  }}
                  className="cursor-pointer"
                />
                {!isDay && (
                  <Line
                    name="Sales Target"
                    type="monotone"
                    dataKey="sales_target"
                    strokeWidth={1}
                    stroke={colors.green[8]}
                    activeDot={{ r: 6 }}
                  >
                    {/* <LabelList content={(v) => setLineLabel(v)} /> */}
                  </Line>
                )}

                <Line
                  name="Actual Sales"
                  type="monotone"
                  strokeWidth={1}
                  dataKey="actual_sales"
                  stroke={colors.blue[8]}
                  activeDot={{ r: 6 }}
                >
                  {/* <LabelList content={(v) => setLineLabel(v)} /> */}
                </Line>
              </LineChart>
            ) : (
              <LineChart
                data={[]}
                margin={{
                  top: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey="actual_sales"
                  domain={domain[salesType!]}
                  tickCount={
                    salesType === 'Month' ? domain.tickMonth : domain.tickYear
                  }
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
        {chart === 'Bar' && (
          <ResponsiveContainer
            width="100%"
            height={300}
            className="text-[11px] cursor-pointer"
          >
            {memoData.length ? (
              <BarChart
                data={memoData}
                margin={{
                  top: 10,
                  right: 30,
                }}
                onClick={handleLineClick}
                style={{
                  cursor: 'pointer',
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey="actual_sales"
                  domain={domain[salesType!]}
                  tickCount={
                    salesType === 'Month' ? domain.tickMonth : domain.tickYear
                  }
                />
                <Tooltip />
                <Legend
                  margin={{ bottom: 10 }}
                  iconSize={20}
                  iconType="square"
                  fontSize={24}
                  fontWeight={800}
                  wrapperStyle={{
                    fontWeight: 600,
                  }}
                  className="cursor-pointer"
                />
                {!isDay && (
                  <Bar
                    name="Sales Target"
                    dataKey="sales_target"
                    fill={colors.green[8]}
                  />
                )}

                <Bar
                  name="Actual Sales"
                  dataKey="actual_sales"
                  fill={colors.blue[8]}
                />
              </BarChart>
            ) : (
              <BarChart
                data={[]}
                margin={{
                  top: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey="actual_sales"
                  domain={domain[salesType!]}
                  tickCount={
                    salesType === 'Month' ? domain.tickMonth : domain.tickYear
                  }
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
        {chart === 'Line Filled' && (
          <ResponsiveContainer
            width="100%"
            height={300}
            className="text-[11px] cursor-pointer"
          >
            {memoData.length ? (
              <AreaChart
                data={memoData}
                margin={{
                  top: 10,
                  right: 30,
                }}
                onClick={handleLineClick}
                style={{
                  cursor: 'pointer',
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey="actual_sales"
                  domain={domain[salesType!]}
                  tickCount={
                    salesType === 'Month' ? domain.tickMonth : domain.tickYear
                  }
                />
                <Tooltip />
                <Legend
                  margin={{ bottom: 10 }}
                  iconSize={20}
                  iconType="square"
                  fontSize={24}
                  fontWeight={800}
                  wrapperStyle={{
                    fontWeight: 600,
                  }}
                  className="cursor-pointer"
                />
                {!isDay && (
                  <Area
                    type="linear"
                    name="Sales Target"
                    dataKey="sales_target"
                    fill={colors.green[8]}
                    stroke={colors.green[8]}
                  />
                )}

                <Area
                  type="linear"
                  name="Actual Sales"
                  dataKey="actual_sales"
                  stroke={colors.blue[8]}
                  fill={colors.blue[8]}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={[]}
                margin={{
                  top: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  dataKey="actual_sales"
                  domain={domain[salesType!]}
                  tickCount={
                    salesType === 'Month' ? domain.tickMonth : domain.tickYear
                  }
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </Box>
  );
};

export default memo(MainSaleGraph);
