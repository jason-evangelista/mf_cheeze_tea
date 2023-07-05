import { PropsWithChildren } from 'react';
import Navbar from '../Navbar/Navbar';
import Container from './Container';
import SalesNavigation from './SalesNavigation';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <Container>
      <Navbar />
      <div className="mt-6 flex items-start gap-4">
        <div>
          <SalesNavigation />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </Container>
  );
};

export default DashboardLayout;
