import { Order, SalesTarget } from '@prisma/client';

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

export default calculateSalesByMonth;
