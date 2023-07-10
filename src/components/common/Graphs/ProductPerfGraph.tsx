import { ProductPerformance } from '@/types/ProductPerformance';
import { useMantineTheme } from '@mantine/core';
import { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ProductPerfProps = {
  data: ProductPerformance[];
};

const ProductPerfGraph = ({ data }: ProductPerfProps) => {
  const { colors } = useMantineTheme();
  const memoData = useMemo(() => {
    if (!data.length) return [];
    return data;
  }, [data]);

  const setLabel = ({ x, y, value, width }: any) => {
    const fireOffset = value.toString().length < 5;
    const offset = fireOffset ? -0 : 5;
    return (
      <text
        x={x + width - offset}
        y={y}
        dy={30}
        fill={colors.blue[9]}
        fontSize={11}
        dx={5}
        fontWeight={800}
      >
        {new Intl.NumberFormat('fil-PH', {
          style: 'currency',
          currency: 'PHP',
        }).format(value)}
      </text>
    );
  };
  const maxDomain = Math.max(...memoData.map((item) => item.over_all_sale));

  return (
    <div className="pb-8">
      <div>
        <ResponsiveContainer
          width="100%"
          height={80 * memoData?.length}
          className="text-sm mt-4"
        >
          <BarChart
            layout="vertical"
            data={memoData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="over_all_sale"
              orientation="top"
              domain={[0, maxDomain + 2000]}
              tickCount={10}
            />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip />
            <Legend
              verticalAlign="top"
              height={30}
              wrapperStyle={{ fontWeight: 600 }}
            />

            <Bar
              name="Quantity Sold"
              dataKey="qty_sold"
              fill={colors.green[8]}
              stackId="non_serradura"
            />
            <Bar
              name="Regular Size"
              dataKey="regular_size"
              fill="#ff0000"
              stackId="non_serradura"
            />
            <Bar
              name="Large Size"
              dataKey="large_size"
              fill={colors.orange[8]}
              stackId="non_serradura"
            />
            <Bar
              name="Over All Sales"
              dataKey="over_all_sale"
              fill={colors.blue[8]}
              stackId="non_serradura"
            >
              <LabelList content={(v) => setLabel(v)} position="center" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(ProductPerfGraph);
