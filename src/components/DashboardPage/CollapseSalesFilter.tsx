import { Collapse, Divider, Select, Tabs } from '@mantine/core';
import {
  DatePickerInput,
  MonthPickerInput,
  YearPickerInput,
} from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useContext } from 'react';
import { DashboardContext } from './DashboardContext';

type CollapseSalesFilterProps = {
  opened: boolean;
};

const CollapseSalesFilter = ({ opened }: CollapseSalesFilterProps) => {
  const { handleChangeSalesType } = useContext(DashboardContext);
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
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select data={[]} placeholder="Select Product" />
              <DatePickerInput placeholder="Select Date" type="range" />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="Month" className="px-4">
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select data={[]} placeholder="Select Product" />
              <MonthPickerInput placeholder="Select Month" type="range" />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="Year" className="px-4">
            <div className="max-w-[30%] flex flex-col gap-2">
              <Select data={[]} placeholder="Select Product" />
              <YearPickerInput placeholder="Select Year" type="range" />
            </div>
          </Tabs.Panel>
        </Tabs>
      </Collapse>
      <Divider />
    </>
  );
};

export default CollapseSalesFilter;
