import { ReactNode } from 'react';

type PriceDisplayProps = {
  value: ReactNode;
};
const PriceDisplay = ({ value }: PriceDisplayProps) => {
  const cur = new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP',
  });
  if (!value) return <span>-</span>;
  return <span>{cur.format(value as number)}</span>;
};

export default PriceDisplay;
