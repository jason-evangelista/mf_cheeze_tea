export type SalesTargetBody = {
  year: number;
  month: string;
  sales_target: number;
  type: 'Month' | 'Year';
};
