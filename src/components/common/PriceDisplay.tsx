import { ReactNode } from 'react';

type PriceDisplayProps = {
  value: ReactNode;
  fallback?: ReactNode;
};
const PriceDisplay = ({ value, fallback }: PriceDisplayProps) => {
  const cur = new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP',
  });
  if (!value) return <span>{fallback ?? '-'}</span>;
  return <span>{cur.format(value as number)}</span>;
};

export default PriceDisplay;
