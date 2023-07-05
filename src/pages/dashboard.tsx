import DashboardContextProvider from '@/components/DashboardPage/DashboardContext';
import DashboardPage from '@/components/DashboardPage/DashboardPage';
import SeoContainer from '@/components/common/SeoContainer';

const Dashboard = () => {
  return (
    <SeoContainer title="Dashboard">
      <DashboardContextProvider>
        <DashboardPage />
      </DashboardContextProvider>
    </SeoContainer>
  );
};

export default Dashboard;
