import { CategoryPerformance } from '@/types/CategoryPerformance';
import { ProductType } from '@prisma/client';
import { memo, useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

export type CategoryPerfGraphProps = {
  data: CategoryPerformance[];
};

const categoryLabel: Record<string, string> = {
  [ProductType.CHEEZE_TEA]: 'Cheeze Tea',
  [ProductType.GREEN_TEA_AND_LEMONADE]: 'Green Tea & Lemonade',
  [ProductType.SERRADURA]: 'Serradura',
  [ProductType.MILK_TEA]: 'Milk Tea',
};

const CategoryPerfGraph = ({ data }: CategoryPerfGraphProps) => {
  const COLORS = ['#0088FE', '#03c859', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: any) => {
    const radius = 25 + innerRadius + (outerRadius - innerRadius) * 0.9;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        fontSize={12}
        dominantBaseline="central"
        fontWeight={700}
      >
        <tspan>{categoryLabel[memoData[index].name]},</tspan>&nbsp;
        <tspan fill={COLORS[index]}>{memoData[index].percentage}%,</tspan>&nbsp;
        <tspan>
          (
          {new Intl.NumberFormat('fil-PH', {
            style: 'currency',
            currency: 'PHP',
          }).format(memoData[index].value)}
          )
        </tspan>
      </text>
    );
  };

  const memoData = useMemo(() => {
    if (!data.length) return [];
    return data;
  }, [data]);
  return (
    <div className="pb-8">
      <h3 className="font-semibold text-center">Category Performance</h3>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart width={600} height={600}>
          <Pie
            data={memoData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={200}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(CategoryPerfGraph);
