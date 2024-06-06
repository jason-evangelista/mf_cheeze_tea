import DashboardContextProvider from '@/components/DashboardPage/DashboardContext';
import DashboardPage from '@/components/DashboardPage/DashboardPage';
import SeoContainer from '@/components/common/SeoContainer';
import SearchProvider from '@/providers/SearchProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, []);
  return (
    <SeoContainer title="Dashboard">
      <DashboardContextProvider>
        <SearchProvider>
          <DashboardPage />
        </SearchProvider>
      </DashboardContextProvider>
    </SeoContainer>
  );
};

export default Dashboard;
