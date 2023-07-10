import useToggleContainer from '@/hooks/useToggleContainer';
import { ProductSchema } from '@/schema/schema';
import { Button, Paper } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
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
    <Paper radius="md" className="p-4">
      <ProductForm
        handleToggle={handleToggle}
        isOpen={isOpen}
        handleClose={handleClose}
        initialValue={memoProductInfo}
        removeProdInfoOnClose={removeProductInfoOnClose}
      />
      <div className="w-full flex justify-end my-2">
        <Button
          onClick={handleToggle}
          color="green"
          leftIcon={<IconPlus />}
          size="sm"
        >
          Add Product
        </Button>
      </div>
      <ProductListTable handleGetProductInfo={handleGetProductInfo} />
    </Paper>
  );
};

export default ProductListPage;
