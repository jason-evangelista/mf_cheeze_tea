import { ReactNode } from 'react';

type LoadingProps = {
  label: ReactNode;
};
const Loading = ({ label }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center mx-auto gap-2 my-3">
      <div className="w-5 h-5 rounded-full border-gray-600 border-2 border-t-white animate-spin " />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Loading;
