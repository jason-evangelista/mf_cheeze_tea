import { productType } from '@/constants/productType';
import { SearchContext } from '@/providers/SearchProvider';
import { ProductSchema } from '@/schema/schema';
import { Button, Group, Modal, Paper, Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch, IconTag } from '@tabler/icons-react';
import { useContext, useMemo, useState } from 'react';
import ProductForm from './ProductForm';
import ProductListTable from './ProductListTable';

const ProductListPage = () => {
  const [productInfo, setProductInfo] = useState<
    ProductSchema & { id: string }
  >();
  const [opened, { close, open }] = useDisclosure(false);
  const {
    searchKey,
    setSearchKey,
    setProductType,
    productType: productFilterType,
  } = useContext(SearchContext);

  const handleGetProductInfo = (payload: ProductSchema & { id: string }) => {
    setProductInfo({ ...payload });
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
      product_photo: '',
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
        <div className="w-full flex justify-between my-2">
          <Group>
            <Select
              icon={<IconTag size={16} />}
              clearable
              data={productType}
              placeholder="Select product type"
              w={250}
              onChange={(e) => setProductType(e ?? '')}
            />
            {productFilterType && (
              <TextInput
                icon={<IconSearch size={16} />}
                placeholder="Search product name"
                onChange={(v) => setSearchKey(v.currentTarget.value)}
                w={300}
              />
            )}
          </Group>
          <Button
            onClick={open}
            color="green"
            leftIcon={<IconPlus />}
            size="sm"
          >
            Add Product
          </Button>
        </div>
        <ProductListTable
          handleGetProductInfo={handleGetProductInfo}
          searchKey={searchKey}
          productFilterType={productFilterType}
        />
      </Paper>
    </>
  );
};

export default ProductListPage;
