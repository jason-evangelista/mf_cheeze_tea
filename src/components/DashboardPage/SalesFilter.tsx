import { useContext } from 'react';
import ReactDropdown, { type Option } from 'react-dropdown';
import Input from '../common/Input';
import Menu from '../common/Menu';
import { DashboardContext } from './DashboardContext';

export type SalesSettingsProps = {
  isOpen: boolean;
  handleClose: VoidFunction;
};

const SALES_OPTION: Option[] = [
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Year',
    value: 'year',
  },
];

const SalesFilter = ({ isOpen }: SalesSettingsProps) => {
  const {
    handleChangeSalesType,
    salesType,
    salesYear,
    yearRange,
    handleSetSaleYear,
    handleYearSaleStart,
    handleYearSaleEnd,
  } = useContext(DashboardContext);

  return (
    <>
      {isOpen && (
        <Menu isOpen={isOpen} className="p-3 top-[3.2rem]">
          <div>
            <h3 className="text-sm font-semibold text-left mb-2">Filter</h3>
            <div>
              <ReactDropdown
                value={salesType}
                options={SALES_OPTION}
                className="text-xs text-left font-medium"
                onChange={(v) => {
                  if (typeof handleChangeSalesType === 'function')
                    handleChangeSalesType(v.label as 'Month' | 'Year');
                }}
              />
            </div>
            {salesType === 'Month' && (
              <div className="text-left">
                <Input
                  labelTitle="Year"
                  placeholder="Year"
                  type="number"
                  className="text-sm"
                  title="Please provide valid year"
                  defaultValue={salesYear}
                  onChange={(e) => {
                    if (typeof handleSetSaleYear === 'function')
                      handleSetSaleYear(Number(e?.currentTarget?.value));
                  }}
                />
              </div>
            )}

            {salesType === 'Year' && (
              <div>
                <Input
                  labelTitle="Start Year"
                  className="text-sm"
                  type="number"
                  value={yearRange?.start_year}
                  onChange={(e) => {
                    if (typeof handleYearSaleStart === 'function')
                      handleYearSaleStart(Number(e?.currentTarget?.value));
                  }}
                />
                <Input
                  labelTitle="End Year"
                  className="text-sm"
                  type="number"
                  value={yearRange?.end_year}
                  onChange={(e) => {
                    if (typeof handleYearSaleEnd === 'function')
                      handleYearSaleEnd(Number(e?.currentTarget?.value));
                  }}
                />
              </div>
            )}
          </div>
        </Menu>
      )}
    </>
  );
};

export default SalesFilter;
