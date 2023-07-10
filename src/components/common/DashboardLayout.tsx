import {
  AppShell,
  Header,
  Navbar as MNavbar,
  useMantineTheme,
} from '@mantine/core';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import Navbar from '../Navbar/Navbar';
import SalesNavigation from './SalesNavigation';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { colors } = useMantineTheme();

  const headerClassName = clsx([
    'flex flex-col justify-center',
    {
      [`bg-[${colors.blue[8]}]`]: !!colors.blue[8],
    },
  ]);
  return (
    <AppShell
      padding="md"
      navbar={
        <MNavbar width={{ base: 200 }}>
          <SalesNavigation />
        </MNavbar>
      }
      header={
        <Header height={60} className={headerClassName}>
          <Navbar />
        </Header>
      }
      bg={colors.gray[1]}
    >
      <main className="flex-1">{children}</main>
    </AppShell>
  );
};

export default DashboardLayout;
