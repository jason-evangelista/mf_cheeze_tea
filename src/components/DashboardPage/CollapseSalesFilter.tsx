import { Collapse, Divider, LoadingOverlay, Select, Tabs } from '@mantine/core';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';
import { Product } from '@prisma/client';
import { IconCalendar } from '@tabler/icons-react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const {
    handleChangeSalesType,
    handleSetSaleYear,
    handleSetProductId,
    handleDashboardOrdersMonth,
    handleFilterYearRange,
    handleDashboardOrdersYear,
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
          variant="pills"
          defaultValue="Month"
          orientation="vertical"
          onTabChange={(e) => {
            router.replace('/dashboard');
            if (typeof handleChangeSalesType === 'function')
              handleChangeSalesType(e as 'Today' | 'Month' | 'Year');
          }}
        >
          <Tabs.List>
            <Tabs.Tab
              value="Today"
              className="font-semibold text-xs"
              icon={<IconCalendar size={18} />}
            >
              Today
            </Tabs.Tab>
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
          <Tabs.Panel value="Today" className="px-4">
            <LoadingOverlay visible={isLoading} />
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select data={memoProductData} placeholder="Select Product" />
              <DatePickerInput
                placeholder="Select Date"
                type="range"
                onChange={(e) => console.log({ e })}
              />
            </div>
          </Tabs.Panel>
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
              <Select
                data={memoProductData}
                placeholder="Select Product"
                clearable
                onChange={(e) => {
                  if (typeof handleSetProductId === 'function')
                    handleSetProductId(e as string, 'Year');

                  if (typeof handleDashboardOrdersYear === 'function')
                    handleDashboardOrdersYear(e as string);
                }}
              />
              <YearPickerInput
                placeholder="Select Year"
                type="range"
                onChange={(e) => {
                  if (!e[0]?.getFullYear() || !e[1]?.getFullYear()) return;

                  if (typeof handleFilterYearRange === 'function')
                    handleFilterYearRange({
                      start: e[0].getFullYear(),
                      end: e?.[1].getFullYear(),
                    });
                }}
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
