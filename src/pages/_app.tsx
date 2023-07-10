import baseApi from '@/clients/baseApi';
import DashboardLayout from '@/components/common/DashboardLayout';
import { RouterTransition } from '@/components/common/RouteTransition';
import AuthProvider from '@/providers/AuthProvider';
import '@/styles/globals.scss';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import 'react-day-picker/dist/style.css';
import 'react-dropdown/style.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const shoudInDashboardLayout =
    router.pathname.includes('/dashboard') ||
    router.pathname.includes('/products') ||
    router.pathname.includes('/orders') ||
    router.pathname.includes('/sales-report');

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
        fontFamily: 'Poppins',
      }}
    >
      <ModalsProvider>
        <RouterTransition />
        <ApiProvider api={baseApi}>
          <ToastContainer theme="colored" hideProgressBar />
          {shoudInDashboardLayout ? (
            <AuthProvider>
              <DashboardLayout>
                <Component {...pageProps} />
              </DashboardLayout>
            </AuthProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </ApiProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
