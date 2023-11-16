import { Order, SalesTarget } from '@prisma/client';
import { eachDayOfInterval, format } from 'date-fns';

const calculateSalesByMonth = (
  month: Order[],
  label: string,
  salesTarget: SalesTarget[],
  prevMonth: Order[]
) => {
  const currentMonthSales = month.reduce(
    (prev, { sub_total }) => prev + sub_total,
    0
  );
  const prevMonthSales = prevMonth.reduce(
    (prev, { sub_total }) => prev + sub_total,
    0
  );
  const growthRate = (currentMonthSales - prevMonthSales) / prevMonthSales;

  const salesNextTarget = currentMonthSales + growthRate * currentMonthSales;

  return {
    actual_sales: month.reduce((prev, { sub_total }) => prev + sub_total, 0),
    label,
    sales_target:
      salesNextTarget.toFixed(0) === 'Infinity'
        ? 0
        : salesNextTarget.toFixed(0),
  };
};

export const calculateSalesByYear = async (
  startYear: number,
  endYear: number,
  data: Order[]
) => {
  const yearGroup: number[] = [];
  for (let i = startYear; i <= endYear; i++) {
    yearGroup.push(i);
  }

  const divideItemByYear = yearGroup.reduce((prev, year) => {
    const findItem = data?.filter(
      (item) => !item.order_date.toISOString().search(year.toString())
    );

    console.log({ findItem });

    const currentYearSales = findItem.reduce(
      (prev, { sub_total }) => prev + sub_total,
      0
    );
    const prevYearSales = data
      ?.filter(
        (item) => !item.order_date.toISOString().search((year - 1).toString())
      )
      .reduce((prev, { sub_total }) => prev + sub_total, 0);

    const growthRate = (currentYearSales - prevYearSales) / prevYearSales;
    const salesNextTarget = currentYearSales + growthRate * currentYearSales;

    // const findYearSaleTarget =
    //   salesTarget.find((item) => item.year?.toString().match(year.toString()))
    //     ?.target ?? 0;

    return {
      ...prev,
      [year]: {
        actual_sales: findItem.reduce(
          (prev, { sub_total }) => prev + sub_total,
          0
        ),
        label: year.toString(),
        sales_target:
          salesNextTarget.toFixed(0) === 'Infinity'
            ? 0
            : salesNextTarget.toFixed(0),
      },
    };
  }, {});

  console.log({ divideItemByYear });

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
