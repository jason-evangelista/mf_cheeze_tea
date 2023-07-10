import useToggleContainer from '@/hooks/useToggleContainer';
import { Paper } from '@mantine/core';
import Button from '../common/Button';
import OrderForm from './OrderForm';
import OrderListTable from './OrderListTable';

const OrderPage = () => {
  const { isOpen, handleToggle, handleClose } = useToggleContainer();

  return (
    <Paper radius="md" className="p-4">
      {isOpen && (
        <OrderForm
          isOpen={isOpen}
          handleToggle={handleToggle}
          handleClose={handleClose}
        />
      )}
      <div className="flex justify-end">
        <Button
          btnTitle="Add Order"
          className="bg-green-500 text-xs my-2"
          onClick={handleToggle}
        />
      </div>
      <OrderListTable />
    </Paper>
  );
};

export default OrderPage;
