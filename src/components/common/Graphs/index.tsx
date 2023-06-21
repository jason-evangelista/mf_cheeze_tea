import dynamic from 'next/dynamic';

export const LazyMainSaleGraph = dynamic(() => import('./MainSaleGraph'), {
  ssr: false,
  loading: () => <div>Building sales graph...</div>,
});
