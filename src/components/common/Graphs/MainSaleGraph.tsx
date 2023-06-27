import { useGetAllOrderQuery } from '@/services/orderService';
import { useEffect } from 'react';
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
const data: { name: string; sales: number; label: string }[] = [
  {
    name: 'Monday',
    sales: 26,
    label: '26%',
  },
  {
    name: 'Tuesday',
    sales: 12,
    label: '12%',
  },
  {
    name: 'Wednesday',
    sales: 24,
    label: '24%',
  },
  {
    name: 'Thursday',
    sales: 29,
    label: '29%',
  },
  {
    name: 'Friday',
    sales: 20,
    label: '20%',
  },
  {
    name: 'Saturday',
    sales: 45,
    label: '45%',
  },
];

const MainSaleGraph = () => {
  const { data: orderData } = useGetAllOrderQuery({
    currentPage: 1,
    searchKey: '',
    showAll: true,
    skip: 0,
  });

  useEffect(() => {
    if (!orderData?.data?.orders.length) return;
    console.log({ orderData: orderData?.data?.orders });

    const overallBasePrice = orderData?.data?.orders?.reduce(
      (prev, { base_amount }) => prev + base_amount,
      0
    );

    const overAllSubTotal = orderData?.data?.orders?.reduce(
      (prev, { sub_total }) => prev + sub_total,
      0
    );

    const overAllQuantity = orderData?.data?.orders?.reduce(
      (prev, { quantity_sale }) => prev + quantity_sale,
      0
    );

    const checkResult = Math.ceil((overAllSubTotal / 7000) * 100);

    console.log({
      overallBasePrice,
      overAllSubTotal,
      overAllQuantity,
      checkResult,
    });
  }, [orderData]);

  const setLineLabel = ({ x, y, stroke, value }: any) => {
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400} className="text-xs">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={<span></span>} />
        <YAxis
          accumulate="none"
          dataKey="sales"
          domain={[0, 100]}
          tickCount={11}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#03c859"
          activeDot={{ r: 6 }}
        >
          <LabelList content={(v) => setLineLabel(v)} />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MainSaleGraph;
