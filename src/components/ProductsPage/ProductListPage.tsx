import useToggleContainer from '@/hooks/useToggleContainer';
import { ProductSchema } from '@/schema/schema';
import { useEffect, useMemo, useState } from 'react';
import Button from '../common/Button';
import ProductForm from './ProductForm';
import ProductListTable from './ProductListTable';

const ProductListPage = () => {
  const { handleClose, handleToggle, isOpen } = useToggleContainer();
  const [productInfo, setProductInfo] = useState<
    ProductSchema & { id: string }
  >();
  const handleGetProductInfo = (payload: ProductSchema & { id: string }) => {
    setProductInfo(payload);
  };

  const removeProductInfoOnClose = () => {
    setProductInfo({
      id: '',
      product_name: '',
      product_type: 'CHEEZE_TEA',
      fixed_amount: undefined,
      large_size_amount: undefined,
      regular_size_amount: undefined,
    });
  };

  const memoProductInfo = useMemo(() => productInfo, [productInfo]);

  useEffect(() => {
    if (!productInfo) return;
    handleToggle();
  }, [productInfo]);

  return (
    <div>
      <ProductForm
        handleToggle={handleToggle}
        isOpen={isOpen}
        handleClose={handleClose}
        initialValue={memoProductInfo}
        removeProdInfoOnClose={removeProductInfoOnClose}
      />
      <div className="w-full flex justify-end my-2">
        <Button
          btnTitle="Add Product"
          onClick={handleToggle}
          className="bg-green-600 text-xs"
        />
      </div>
      <ProductListTable handleGetProductInfo={handleGetProductInfo} />
    </div>
  );
};

export default ProductListPage;
