import OrderPage from '@/components/OrderPage/OrderPage';
import SeoContainer from '@/components/common/SeoContainer';
import SearchProvider from '@/providers/SearchProvider';

const Orders = () => {
  return (
    <SeoContainer title="Order">
      <SearchProvider>
        <OrderPage />
      </SearchProvider>
    </SeoContainer>
  );
};

export default Orders;
