import { Collapse, Divider, LoadingOverlay, Select, Tabs } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { Product } from '@prisma/client';
import { IconCalendar } from '@tabler/icons-react';
import { memo, useContext, useMemo } from 'react';
import { DashboardContext } from './DashboardContext';

type CollapseSalesFilterProps = {
  opened: boolean;
  products: Product[];
  isLoading: boolean;
};

const CollapseSalesFilter = ({
  opened,
  isLoading,
  products,
}: CollapseSalesFilterProps) => {
  const {
    handleChangeSalesType,
    handleSetSaleYear,
    handleSetProductId,
    handleDashboardOrdersMonth,
    dashboardOrdersMonth,
  } = useContext(DashboardContext);

  const memoProductData = useMemo(
    () => products.map((item) => ({ value: item.id, label: item.name })),
    [products]
  );

  return (
    <>
      <Divider />
      <Collapse in={opened} className="py-4">
        <Tabs
          defaultValue="Month"
          orientation="vertical"
          onTabChange={(e) => {
            if (typeof handleChangeSalesType === 'function')
              handleChangeSalesType(e as 'Today' | 'Month' | 'Year');
          }}
        >
          <Tabs.List>
            {/* <Tabs.Tab
              value="Today"
              className="font-semibold text-xs"
              icon={<IconCalendar size={18} />}
            >
              Today
            </Tabs.Tab> */}
            <Tabs.Tab
              value="Month"
              className="font-semibold text-xs"
              icon={<IconCalendar size={18} />}
            >
              Month
            </Tabs.Tab>
            <Tabs.Tab
              value="Year"
              className="font-semibold text-xs"
              icon={<IconCalendar size={18} />}
            >
              Year
            </Tabs.Tab>
          </Tabs.List>
          {/* <Tabs.Panel value="Today" className="px-4">
            <LoadingOverlay visible={isLoading} />
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select data={memoProductData} placeholder="Select Product" />
              <DatePickerInput
                placeholder="Select Date"
                type="range"
                onChange={(e) => console.log({ e })}
              />
            </div>
          </Tabs.Panel> */}
          <Tabs.Panel value="Month" className="px-4">
            <LoadingOverlay visible={isLoading} />
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select
                clearable
                data={memoProductData}
                placeholder="Select Product"
                onChange={(e) => {
                  if (typeof handleSetProductId === 'function')
                    handleSetProductId(e as string, 'Month');
                  if (typeof handleDashboardOrdersMonth === 'function')
                    handleDashboardOrdersMonth({ productId: e ?? '' });
                }}
              />
              <YearPickerInput
                defaultValue={new Date(dashboardOrdersMonth?.year ?? 0, 1, 1)}
                placeholder="Select Year"
                onChange={(e) => {
                  if (typeof handleSetSaleYear === 'function')
                    handleSetSaleYear(e?.getFullYear() ?? 0);

                  if (typeof handleDashboardOrdersMonth === 'function')
                    handleDashboardOrdersMonth({ year: e?.getFullYear() });
                }}
              />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="Year" className="px-4">
            <LoadingOverlay visible={isLoading} />
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select data={memoProductData} placeholder="Select Product" />
              <YearPickerInput
                placeholder="Select Year"
                type="range"
                onChange={(e) => console.log({ e })}
              />
            </div>
          </Tabs.Panel>
        </Tabs>
      </Collapse>
      <Divider />
    </>
  );
};

export default memo(CollapseSalesFilter);
