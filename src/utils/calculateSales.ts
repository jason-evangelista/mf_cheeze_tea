import { Order, SalesTarget } from '@prisma/client';
import { eachDayOfInterval, format } from 'date-fns';

const calculateSalesByMonth = (
  month: Order[],
  label: string,
  salesTarget: SalesTarget[]
) => ({
  actual_sales: month.reduce((prev, { sub_total }) => prev + sub_total, 0),
  label,
  sales_target:
    salesTarget.find((item) => item.month?.match(label))?.target ?? 0,
});

export const calculateSalesByYear = async (
  startYear: number,
  endYear: number,
  data: Order[],
  salesTarget: SalesTarget[]
) => {
  const yearGroup: number[] = [];
  for (let i = startYear; i <= endYear; i++) {
    yearGroup.push(i);
  }

  const divideItemByYear = yearGroup.reduce((prev, year) => {
    const findItem = data?.filter(
      (item) => !item.order_date.toISOString().search(year.toString())
    );

    const findYearSaleTarget =
      salesTarget.find((item) => item.year?.toString().match(year.toString()))
        ?.target ?? 0;

    return {
      ...prev,
      [year]: {
        actual_sales: findItem.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        ),
        label: year.toString(),
        sales_target: findYearSaleTarget,
      },
    };
  }, {});

  return divideItemByYear;
};

export const calculateSalesByDay = async (
  orders: Order[],
  startDate: Date,
  endDate: Date
) => {
  const intervalDates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((item) => format(item, 'yyyy-MM-dd'));

  const salesByDay = intervalDates.reduce((prev, date) => {
    const findDayOverAllSales = orders
      .filter((order) => format(order.order_date, 'yyyy-MM-dd').match(date))
      .reduce((prev, { sub_total }) => prev + sub_total, 0);

    const labelValue = format(new Date(date), 'MMM dd');
    return {
      ...prev,
      [labelValue]: {
        label: labelValue,
        actual_sales: findDayOverAllSales,
        date_value: format(new Date(date), 'yyyy-MM-dd'),
      },
    };
  }, {});

  console.log({ salesByDay });

  return salesByDay;
};

export default calculateSalesByMonth;
