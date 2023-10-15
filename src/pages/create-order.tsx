import CreateOrderContextProvider from '@/components/CreateOrderPage/CreateOrderContextProvider';
import CreateOrderPage from '@/components/CreateOrderPage/CreateOrderPage';
import SeoContainer from '@/components/common/SeoContainer';

const CreateOrder = () => {
  return (
    <SeoContainer title="Create Order">
      <CreateOrderContextProvider>
        <CreateOrderPage />
      </CreateOrderContextProvider>
    </SeoContainer>
  );
};

export default CreateOrder;
