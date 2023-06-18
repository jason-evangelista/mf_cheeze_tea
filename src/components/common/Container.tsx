import { PropsWithChildren } from 'react';

const Container = ({ children }: PropsWithChildren) => {
  return <div className="w-full px-4 mx-auto lg:w-[60%]">{children}</div>;
};

export default Container;
