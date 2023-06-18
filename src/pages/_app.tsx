import baseApi from '@/clients/baseApi';
import AuthProvider from '@/providers/AuthProvider';
import '@/styles/globals.css';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApiProvider api={baseApi}>
      <AuthProvider>
        <ToastContainer theme="colored" hideProgressBar />
        <Component {...pageProps} />
      </AuthProvider>
    </ApiProvider>
  );
}
