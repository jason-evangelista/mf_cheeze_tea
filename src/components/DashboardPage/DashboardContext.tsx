import { PropsWithChildren, createContext, useState } from 'react';

type DashBoardContextProps = {
  // eslint-disable-next-line no-unused-vars
  handleChangeSalesType: (sales_type: 'Month' | 'Year') => void;
  // eslint-disable-next-line no-unused-vars
  handleSetSaleYear: (year: number) => void;
  salesType: 'Month' | 'Year';
  salesYear: number;
  yearRange: {
    start_year: number;
    end_year: number;
  };
  // eslint-disable-next-line no-unused-vars
  handleYearSaleStart: (_: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleYearSaleEnd: (_: number) => void;
};

export const DashboardContext = createContext<Partial<DashBoardContextProps>>(
  {}
);

const DashboardContextProvider = ({ children }: PropsWithChildren) => {
  const [salesType, setSalesType] = useState<'Month' | 'Year'>('Month');
  const [salesYear, setSaleYear] = useState(new Date().getFullYear());
  const [yearRange, setYearRange] = useState<
    DashBoardContextProps['yearRange']
  >({
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear() + 5,
  });

  const handleChangeSalesType = (sales: 'Month' | 'Year') => {
    setSalesType(sales);
  };

  const handleSetSaleYear = (year: number) => {
    setSaleYear(year);
  };

  const handleYearSaleStart = (start: number) =>
    setYearRange({ ...yearRange, start_year: start });
  const handleYearSaleEnd = (end: number) =>
    setYearRange({ ...yearRange, end_year: end });

  return (
    <DashboardContext.Provider
      value={{
        handleChangeSalesType,
        handleSetSaleYear,
        salesType,
        salesYear,
        yearRange,
        handleYearSaleStart,
        handleYearSaleEnd,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
