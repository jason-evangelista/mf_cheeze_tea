import { useCreateSalesTargetMutation } from '@/services/salesTargetService';
import { SalesTargetBody } from '@/types/SalesTarget';
import { useEffect, useRef, useState } from 'react';
import ReactDropdown from 'react-dropdown';
import { toast } from 'react-toastify';
import { useOnClickOutside } from 'usehooks-ts';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export type SalesSettingsProps = {
  isOpen: boolean;
  handleClose: VoidFunction;
  refetchReport: VoidFunction;
};

const SalesSettings = ({
  isOpen,
  handleClose,
  refetchReport,
}: SalesSettingsProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
    handleClose();
  };

  useOnClickOutside(menuRef, () => {
    handleClose();
  });

  useEffect(() => {
    if (salesTargetState.isSuccess) {
      toast(salesTargetState?.data?.message, {
        position: 'top-center',
        type: 'success',
      });
      setSalesTarget({
        month: undefined,
        sales_target: undefined,
        year: undefined,
      });
      refetchReport();
    }
  }, [salesTargetState]);

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          handleToggle={handleClose}
          title="Sales Settings"
        >
          <div className="border-b my-3">
            <h3 className="font-semibold text-sm">Sales Target by Month</h3>
            <div className="flex items-center gap-1">
              <ReactDropdown
                className="text-sm flex-1"
                options={MONTHS}
                onChange={(v) =>
                  setSalesTarget({ ...salesTarget, month: v.value })
                }
              />
              <Input
                placeholder="Year"
                className="text-sm flex-1"
                type="number"
                onChange={(e) =>
                  setSalesTarget({
                    ...salesTarget,
                    year: Number(e?.currentTarget.value),
                  })
                }
              />
              <Input
                placeholder="Sales Target"
                className="text-sm flex-1"
                type="number"
                onChange={(e) =>
                  setSalesTarget({
                    ...salesTarget,
                    sales_target: Number(e?.currentTarget?.value),
                  })
                }
              />
            </div>
            <Button
              onClick={() => handleMutateSalesTarget('Month')}
              loading={salesTargetState.isLoading}
              btnTitle="Set Month Sales Target"
              className="bg-green-500 w-full text-xs font-semibold my-2"
            />
          </div>
          <div className="border-b my-3">
            <h3 className="font-semibold text-sm">Sales Target by Year</h3>
            <div className="flex items-center gap-1">
              <Input
                placeholder="Year"
                className="text-sm"
                type="number"
                onChange={(e) =>
                  setSalesTarget({
                    ...salesTarget,
                    year: Number(e?.currentTarget.value),
                  })
                }
              />
              <Input
                placeholder="Sales Target"
                className="text-sm"
                type="number"
                onChange={(e) =>
                  setSalesTarget({
                    ...salesTarget,
                    sales_target: Number(e?.currentTarget?.value),
                  })
                }
              />
            </div>
            <Button
              onClick={() => handleMutateSalesTarget('Year')}
              loading={salesTargetState.isLoading}
              btnTitle="Set Year Sales Target"
              className="bg-green-500 w-full text-xs font-semibold my-2"
            />
          </div>
          {/* <div className="flex items-start border-b gap-4">
            <div className="my-3 flex-1">
              <h3 className="font-semibold text-sm">Month Domain</h3>
              <Input
                placeholder="Max Value"
                className="text-sm w-full"
                type="number"
              />
              <Button
                btnTitle="Set Month Domain"
                className="bg-green-500 w-full text-xs font-semibold"
              />
            </div>
            <div className="my-3 flex-1">
              <h3 className="font-semibold text-sm">Year Domain</h3>
              <Input
                placeholder="Max Value"
                className="text-sm w-full"
                type="number"
              />
              <Button
                btnTitle="Set Year Domain"
                className="bg-green-500 w-full text-xs font-semibold"
              />
            </div>
          </div> */}
        </Modal>
      )}
    </>
  );
};

export default SalesSettings;
