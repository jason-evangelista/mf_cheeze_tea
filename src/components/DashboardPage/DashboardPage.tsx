import useToggleContainer from '@/hooks/useToggleContainer';
import { IconSettings } from '@tabler/icons-react';
import Button from '../common/Button';
import { LazyMainSaleGraph } from '../common/Graphs';
import SalesSettings from './SalesSettings';

const DashboardPage = () => {
  const { handleClose, handleToggle, isOpen } = useToggleContainer();

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <Button
          onClick={handleToggle}
          btnTitle={
            <>
              <IconSettings size={28} />
              <SalesSettings handleClose={handleClose} isOpen={isOpen} />
            </>
          }
          className="!text-black relative"
        />
      </div>
      <LazyMainSaleGraph />
    </div>
  );
};

export default DashboardPage;
