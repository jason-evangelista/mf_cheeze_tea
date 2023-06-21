import { ReactNode } from 'react';

type PriceDisplayProps = {
  value: ReactNode;
};
const PriceDisplay = ({ value }: PriceDisplayProps) => {
  if (!value) return <span>-</span>;
  return <span>₱{value}</span>;
};

export default PriceDisplay;
