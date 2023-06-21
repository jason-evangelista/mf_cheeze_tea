import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MainSaleGraph = () => {
  const data: { name: string; sales: number }[] = [
    {
      name: 'JAN',
      sales: 30,
    },
    {
      name: 'FEB',
      sales: 70,
    },
    {
      name: 'MAR',
      sales: 40,
    },
    {
      name: 'APR',
      sales: 55,
    },
    {
      name: 'MAY',
      sales: 20,
    },
    {
      name: 'JUNE',
      sales: 90,
    },
    {
      name: 'JULY',
      sales: 40,
    },
    {
      name: 'AUG',
      sales: 23,
    },
    {
      name: 'SEP',
      sales: 90,
    },
    {
      name: 'OCT',
      sales: 40,
    },
    {
      name: 'NOV',
      sales: 30,
    },
    {
      name: 'DEC',
      sales: 40,
    },
  ];

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
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#03c859"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MainSaleGraph;
