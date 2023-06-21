import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import Navbar from '../Navbar/Navbar';
import ProductTabs from '../ProductsPage/ProductTabs';
import Container from './Container';
import SalesNavigation from './SalesNavigation';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  return (
    <Container>
      <Navbar />
      <div className="mt-6 flex items-start gap-4">
        <div>
          <SalesNavigation />
        </div>
        <main className="flex-1">
          {router.pathname.includes('/product') && <ProductTabs />}
          {children}
        </main>
      </div>
    </Container>
  );
};

export default DashboardLayout;
