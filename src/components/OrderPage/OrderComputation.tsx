import { memo } from 'react';
import DescriptionGroup from '../common/DescriptionGroup';
import PriceDisplay from '../common/PriceDisplay';

export type OrderComputationProps = {
  basePrice: number;
  productName: string;
  subTotal: number;
  qty: number;
};
const OrderComputation = ({
  basePrice,
  productName,
  subTotal,
  qty,
}: OrderComputationProps) => {
  return (
    <div className="border-t mt-3">
      <h3 className="font-semibold text-sm py-2">Order Summary</h3>
      <div className="p-2 border rounded-sm">
        <DescriptionGroup
          left={<span className="text-sm">Product Name:</span>}
          right={<span className="text-sm font-semibold">{productName}</span>}
        />
        <DescriptionGroup
          left={<span className="text-sm">Base Price:</span>}
          right={
            <span className="text-sm font-semibold">
              <PriceDisplay value={basePrice} />
            </span>
          }
        />
        <DescriptionGroup
          left={<span className="text-sm">Quantity:</span>}
          right={<span className="text-sm font-semibold">{qty}</span>}
        />
        <DescriptionGroup
          left={<span className="text-sm">Sub total:</span>}
          right={
            <span className="text-sm font-semibold">
              <PriceDisplay value={subTotal} />
            </span>
          }
        />
      </div>
    </div>
  );
};

export default memo(OrderComputation);
