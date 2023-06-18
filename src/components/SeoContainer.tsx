import Head from 'next/head';
import { PropsWithChildren } from 'react';

type SeoContainerProps = {
  title: string;
} & PropsWithChildren;

const SeoContainer = ({ children, title }: SeoContainerProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};

export default SeoContainer;
