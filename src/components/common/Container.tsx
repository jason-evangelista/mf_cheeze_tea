import { PropsWithChildren } from 'react';

const Container = ({ children }: PropsWithChildren) => {
  return <div className="w-full px-4 mx-auto lg:w-[70%]">{children}</div>;
};

export default Container;
