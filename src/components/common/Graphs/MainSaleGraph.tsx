import { DashboardContext } from '@/components/DashboardPage/DashboardContext';
import { SalesMonth, SalesYear } from '@/types/Sales';
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
};

const domain = {
  month: [0, 20000],
  year: [0, 100000],
  tickMonth: 10,
  tickYear: 20,
};

const MainSaleGraph = ({ data }: MainSaleGraphProps) => {
  const { salesType } = useContext(DashboardContext);
  const memoData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).flatMap((item) => ({
      ...item[1],
      name: item[1].label,
    }));
  }, [data, salesType]);

  console.log({ memoData });

  const setLineLabel = ({ x, y, stroke, value }: any) => {
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={11} textAnchor="middle">
        {new Intl.NumberFormat('fil-PH', {
          style: 'currency',
          currency: 'PHP',
        }).format(value)}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400} className="text-xs">
      <LineChart
        data={memoData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          dataKey="actual_sales"
          domain={salesType === 'Month' ? domain.month : domain.year}
          tickCount={salesType === 'Month' ? domain.tickMonth : domain.tickYear}
        />
        <Tooltip />
        <Legend
          margin={{ bottom: 10 }}
          iconSize={20}
          iconType="rect"
          fontSize={24}
        />
        <Line
          animationBegin={0}
          type="monotone"
          dataKey="actual_sales"
          stroke="#03c859"
          activeDot={{ r: 6 }}
        >
          <LabelList content={(v) => setLineLabel(v)} />
        </Line>
        <Line
          type="monotone"
          dataKey="sales_target"
          stroke="#ff0000"
          activeDot={{ r: 6 }}
        >
          <LabelList content={(v) => setLineLabel(v)} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default memo(MainSaleGraph);
