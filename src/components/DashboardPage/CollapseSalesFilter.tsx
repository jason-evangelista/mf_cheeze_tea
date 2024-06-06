import { SearchContext } from '@/providers/SearchProvider';
import {
  Collapse,
  Divider,
  LoadingOverlay,
  Tabs,
  TextInput
} from '@mantine/core';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';
import { Product } from '@prisma/client';
import { IconCalendar, IconSearch } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { memo, useContext } from 'react';
import { DashboardContext } from './DashboardContext';

type CollapseSalesFilterProps = {
  opened: boolean;
  products: Product[];
  isLoading: boolean;
};

const CollapseSalesFilter = ({
  opened,
  isLoading,
}: CollapseSalesFilterProps) => {
  const router = useRouter();

  const { setSearchKey } = useContext(SearchContext);

  const {
    handleChangeSalesType,
    handleSetSaleYear,
    handleDashboardOrdersMonth,
    handleFilterYearRange,
    handleDashboardOrdersDay,
    dashboardOrdersMonth,
  } = useContext(DashboardContext);

  const handleSearchKey = (value: string) => {
    setSearchKey(value.toLowerCase().concat('*'));
  };

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
              <TextInput
                placeholder="Search keyword product names"
                icon={<IconSearch size={16} />}
                w={280}
                onChange={(e) => handleSearchKey(e.currentTarget.value)}
              />
              <DatePickerInput
                placeholder="Select Date"
                type="range"
                onChange={(e) => {
                  if (!e[0] || !e[1]) return;
                  if (typeof handleDashboardOrdersDay === 'function')
                    handleDashboardOrdersDay({
                      start_date: format(e[0], 'yyyy-MM-dd'),
                      end_date: format(e[1], 'yyyy-MM-dd'),
                    });
                }}
              />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="Month" className="px-4">
            <LoadingOverlay visible={isLoading} />
            <div className="max-w-[30%] flex flex-col gap-2">
              <TextInput
                placeholder="Search keyword product names"
                icon={<IconSearch size={16} />}
                w={280}
                onChange={(e) => handleSearchKey(e.currentTarget.value)}
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
              <TextInput
                placeholder="Search keyword product name"
                icon={<IconSearch size={16} />}
                w={280}
                onChange={(e) => handleSearchKey(e.currentTarget.value)}
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
