import CollapseSalesFilter from '@/components/DashboardPage/CollapseSalesFilter';
import { DashboardContext } from '@/components/DashboardPage/DashboardContext';
import { SalesMonth, SalesYear } from '@/types/Sales';
import { Box, Button, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsAlt, IconReportAnalytics } from '@tabler/icons-react';
import { memo, useContext, useMemo } from 'react';
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type MainSaleGraphProps = {
  data?: SalesMonth | SalesYear;
  handleOpenSalesTarget: VoidFunction;
};

const domain = {
  month: [0, 20000],
  year: [0, 100000],
  tickMonth: 10,
  tickYear: 20,
};

const MainSaleGraph = ({ data, handleOpenSalesTarget }: MainSaleGraphProps) => {
  const { colors } = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const { salesType } = useContext(DashboardContext);

  const memoData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).flatMap((item) => ({
      ...item[1],
      name: item[1].label,
    }));
  }, [data, salesType]);

  const setLineLabel = ({ x, y, stroke, value }: any) => {
    return (
      <text
        x={x}
        y={y}
        dy={-4}
        fill={stroke}
        fontSize={11}
        textAnchor="middle"
        fontWeight={700}
      >
        {new Intl.NumberFormat('fil-PH', {
          style: 'currency',
          currency: 'PHP',
        }).format(value)}
      </text>
    );
  };

  return (
    <>
      <div className="flex items-center gap-2 my-4">
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
      </div>
      <Box>
        <CollapseSalesFilter opened={opened} />
      </Box>
      <ResponsiveContainer width="100%" height={500} className="text-sm">
        {memoData.length ? (
          <LineChart
            data={memoData}
            margin={{
              top: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              dataKey="actual_sales"
              domain={salesType === 'Month' ? domain.month : domain.year}
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
            />
            <Line
              name="Sales Target"
              type="monotone"
              dataKey="sales_target"
              strokeWidth={2}
              stroke={colors.green[8]}
              activeDot={{ r: 6 }}
            >
              <LabelList content={(v) => setLineLabel(v)} />
            </Line>
            <Line
              name="Actual Sales"
              type="monotone"
              strokeWidth={2}
              dataKey="actual_sales"
              stroke={colors.blue[8]}
              activeDot={{ r: 6 }}
            >
              <LabelList content={(v) => setLineLabel(v)} />
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
              domain={salesType === 'Month' ? domain.month : domain.year}
              tickCount={
                salesType === 'Month' ? domain.tickMonth : domain.tickYear
              }
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </>
  );
};

export default memo(MainSaleGraph);
