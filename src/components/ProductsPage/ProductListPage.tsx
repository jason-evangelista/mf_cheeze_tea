import { ProductSchema } from '@/schema/schema';
import { Button, Modal, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import ProductForm from './ProductForm';
import ProductListTable from './ProductListTable';

const ProductListPage = () => {
  const [productInfo, setProductInfo] = useState<
    ProductSchema & { id: string }
  >();
  const [opened, { close, open }] = useDisclosure(false);

  const handleGetProductInfo = (payload: ProductSchema & { id: string }) => {
    setProductInfo(payload);
    open();
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

  return (
    <>
      <Modal
        title="Product"
        opened={opened}
        onClose={() => {
          close();
          removeProductInfoOnClose();
        }}
      >
        <ProductForm
          handleClose={close}
          isOpen={opened}
          initialValue={memoProductInfo}
          removeProdInfoOnClose={removeProductInfoOnClose}
        />
      </Modal>
      <Paper radius="md" className="p-4">
        <div className="w-full flex justify-end my-2">
          <Button
            onClick={open}
            color="green"
            leftIcon={<IconPlus />}
            size="sm"
          >
            Add Product
          </Button>
        </div>
        <ProductListTable handleGetProductInfo={handleGetProductInfo} />
      </Paper>
    </>
  );
};

export default ProductListPage;
