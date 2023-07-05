import { ProductPerformance } from '@/types/ProductPerformance';
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
  const memoData = useMemo(() => {
    if (!data.length) return [];
    return data;
  }, [data]);

  const setLabel = ({ x, y, stroke, value, width }: any) => {
    const fireOffset = value.toString().length < 5;
    const offset = fireOffset ? -0 : 5;
    return (
      <text x={x + width - offset} y={y} dy={-4} fill={stroke} fontSize={11}>
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
      <h3 className="font-semibold text-center">Product Performance</h3>
      <div>
        <ResponsiveContainer
          width="100%"
          height={100 * memoData?.length}
          className="text-xs mt-4 max-h-[700px] overflow-hidden overflow-y-auto"
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
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend verticalAlign="top" height={30} />
            <Bar dataKey="over_all_sale" fill="#E97451" stackId="non_serradura">
              <LabelList content={(v) => setLabel(v)} position="center" />
            </Bar>
            <Bar dataKey="qty_sold" fill="#03c859" stackId="non_serradura" />
            <Bar
              dataKey="regular_size"
              fill="#ff0000"
              stackId="non_serradura"
            />
            <Bar dataKey="large_size" fill="#0000ff" stackId="non_serradura" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(ProductPerfGraph);
