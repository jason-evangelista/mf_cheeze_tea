import useToggleContainer from '@/hooks/useToggleContainer';
import Button from '../common/Button';
import OrderForm from './OrderForm';
import OrderListTable from './OrderListTable';

const OrderPage = () => {
  const { isOpen, handleToggle, handleClose } = useToggleContainer();

  return (
    <div>
      {isOpen && (
        <OrderForm
          isOpen={isOpen}
          handleToggle={handleToggle}
          handleClose={handleClose}
        />
      )}
      <div className='flex justify-end'>
        <Button
          btnTitle="Add Order"
          className="bg-green-500 text-xs my-2"
          onClick={handleToggle}
        />
      </div>
      <OrderListTable />
    </div>
  );
};

export default OrderPage;
