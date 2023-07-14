import { useCreateSalesTargetMutation } from '@/services/salesTargetService';
import { SalesTargetBody } from '@/types/SalesTarget';
import { Button, Divider, NumberInput } from '@mantine/core';
import { MonthPickerInput, YearPickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export type SalesSettingsProps = {
  refetchReport: VoidFunction;
};

const SalesSettings = ({ refetchReport }: SalesSettingsProps) => {
  const [salesTarget, setSalesTarget] = useState<
    Partial<Omit<SalesTargetBody, 'type'>>
  >({});

  const [createSalesTarget, salesTargetState] = useCreateSalesTargetMutation();

  const handleMutateSalesTarget = async (type: 'Month' | 'Year') => {
    await createSalesTarget({
      month: salesTarget?.month ?? '',
      year: salesTarget?.year ?? 0,
      sales_target: salesTarget?.sales_target ?? 0,
      type,
    });
  };

  useEffect(() => {
    if (salesTargetState.isSuccess) {
      notifications.show({
        title: 'Sales Target',
        message: salesTargetState?.data?.message,
        color: 'green',
      });

      setSalesTarget({
        month: undefined,
        sales_target: undefined,
        year: undefined,
      });
      refetchReport();
    }
  }, [salesTargetState.isSuccess]);

  return (
    <>
      <div className="border-b my-3">
        <h3 className="font-semibold text-sm m-0">Sales Target by Month</h3>
        <div className="flex flex-col gap-1">
          <MonthPickerInput
            label="Select Month"
            placeholder="Select Month"
            onChange={(e) => {
              const [month, year] = format(
                new Date(e ?? new Date()),
                'MMMM yyyy'
              ).split(' ');

              setSalesTarget({
                ...salesTarget,
                month,
                year: +year,
              });
            }}
          />
          <NumberInput
            label="Sales Target"
            parser={(value) => value.replace(/₱\s?|(,*)/g, '')}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `₱ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                : '₱ '
            }
            onChange={(value) =>
              setSalesTarget({
                ...salesTarget,
                sales_target: Number(value),
              })
            }
          />
        </div>
        <Button
          onClick={() => handleMutateSalesTarget('Month')}
          size="sm"
          loading={salesTargetState.isLoading}
          className="my-2 w-full"
        >
          Set Month Sales Target
        </Button>
      </div>
      <Divider />
      <div className="border-b my-3">
        <h3 className="font-semibold text-sm m-0">Sales Target by Year</h3>
        <div className="flex flex-col gap-1">
          <YearPickerInput
            label="Select Year"
            placeholder="Select Year"
            onChange={(e) => {
              console.log(e?.getFullYear());
              setSalesTarget({
                ...salesTarget,
                year: e?.getFullYear(),
              });
            }}
          />
          <NumberInput
            label="Sales Target"
            parser={(value) => value.replace(/₱\s?|(,*)/g, '')}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `₱ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                : '₱ '
            }
            onChange={(value) => {
              setSalesTarget({
                ...salesTarget,
                sales_target: Number(value),
              });
            }}
          />
        </div>
        <Button
          onClick={() => handleMutateSalesTarget('Year')}
          size="sm"
          loading={salesTargetState.isLoading}
          className="my-2 w-full"
        >
          Set Year Sales Target
        </Button>
      </div>
    </>
  );
};

export default SalesSettings;
