import { ReactNode } from 'react';

type DescriptionGroupProps = {
  right: ReactNode;
  left: ReactNode;
};

const DescriptionGroup = ({ left, right }: DescriptionGroupProps) => {
  return (
    <div className="flex items-center gap-1 my-1">
      {left}
      {right}
    </div>
  );
};

export default DescriptionGroup;
