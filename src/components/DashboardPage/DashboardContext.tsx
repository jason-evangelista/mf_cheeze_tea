/* eslint-disable no-unused-vars */
import { PropsWithChildren, createContext, useState } from 'react';

type DashBoardContextProps = {
  // eslint-disable-next-line no-unused-vars
  handleChangeSalesType: (sales_type: 'Today' | 'Month' | 'Year') => void;
  // eslint-disable-next-line no-unused-vars
  handleSetSaleYear: (year: number) => void;
  salesType: 'Today' | 'Month' | 'Year';
  salesYear: number;
  yearRange: {
    start_year: number;
    end_year: number;
  };
  // eslint-disable-next-line no-unused-vars
  handleYearSaleStart: (_: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleYearSaleEnd: (_: number) => void;
  productId: {
    today: string;
    month: string;
    year: string;
  };
  // eslint-disable-next-line no-unused-vars
  handleSetProductId: (_: string, _t: 'Today' | 'Month' | 'Year') => void;

  dashboardOrdersMonth: {
    productId?: string;
    year: number;
  };
  dashboardOrdersYear: {
    productId?: string;
  };

  // eslint-disable-next-line no-unused-vars
  handleDashboardOrdersMonth: ({
    year,
    productId,
  }: {
    year?: number;
    productId?: string;
  }) => void;
  handleDashboardOrdersYear: (
    // eslint-disable-next-line no-unused-vars
    productId?: string
  ) => void;
  handleFilterYearRange: (arg: { start: number; end: number }) => void;
};

export const DashboardContext = createContext<Partial<DashBoardContextProps>>(
  {}
);

const DashboardContextProvider = ({ children }: PropsWithChildren) => {
  const [salesType, setSalesType] = useState<'Today' | 'Month' | 'Year'>(
    'Month'
  );
  const [salesYear, setSaleYear] = useState(new Date().getFullYear());
  const [yearRange, setYearRange] = useState<
    DashBoardContextProps['yearRange']
  >({
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear() + 5,
  });

  const [productId, setProductId] = useState<
    DashBoardContextProps['productId']
  >({
    month: '',
    today: '',
    year: '',
  });

  const [dashboardOrdersMonth, setDashboardOrderMonth] = useState<{
    productId?: string;
    year: number;
  }>({
    year: new Date().getFullYear(),
  });

  const [dashboardOrdersYear, setDashboardOrdersYear] = useState<{
    productId?: string;
  }>({});

  const handleChangeSalesType = (sales: 'Today' | 'Month' | 'Year') => {
    setSalesType(sales);
  };

  const handleSetSaleYear = (year: number) => {
    setSaleYear(year);
  };

  const handleYearSaleStart = (start: number) =>
    setYearRange({ ...yearRange, start_year: start });
  const handleYearSaleEnd = (end: number) =>
    setYearRange({ ...yearRange, end_year: end });

  const handleFilterYearRange = ({
    start,
    end,
  }: {
    start: number;
    end: number;
  }) => {
    setYearRange({ start_year: start, end_year: end });
  };

  const handleSetProductId = (id: string, type: 'Today' | 'Month' | 'Year') => {
    if (type === 'Today') {
      setProductId({ ...productId, today: id });
    }
    if (type === 'Month') {
      setProductId({ ...productId, month: id });
    }
    if (type === 'Year') {
      setProductId({ ...productId, year: id });
    }
  };

  const handleDashboardOrdersMonth = ({
    productId,
    year,
  }: Partial<DashBoardContextProps['dashboardOrdersMonth']>) => {
    setDashboardOrderMonth({
      year: year as number,
      productId,
    });
  };

  const handleDashboardOrdersYear = (productId?: string) => {
    setDashboardOrdersYear({
      ...dashboardOrdersYear,
      productId,
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        salesType,
        salesYear,
        productId,
        yearRange,
        dashboardOrdersMonth,
        dashboardOrdersYear,
        handleDashboardOrdersYear,
        handleDashboardOrdersMonth,
        handleChangeSalesType,
        handleSetSaleYear,
        handleYearSaleStart,
        handleYearSaleEnd,
        handleSetProductId,
        handleFilterYearRange,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
