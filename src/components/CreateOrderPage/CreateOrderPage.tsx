import { productType } from '@/constants/productType';
import { useGetAllProductCategoryQuery } from '@/services/productCategoryService';
import { useGetAllProductQuery } from '@/services/productService';
import { Grid, Modal, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Product } from '@prisma/client';
import { IconCup } from '@tabler/icons-react';
import { useContext, useMemo, useState } from 'react';
import CreateOrderCart from './CreateOrderCart';
import { CreateOrderContext } from './CreateOrderContextProvider';
import CreateOrderMenu from './CreateOrderMenu';
import ProductOrderModal from './ProductOrderModal';
import mapProductWithCategory from './helper/mapProductWithCategory';

const CreateOrderPage = () => {
  const { colors } = useMantineTheme();
  const productCategory = useGetAllProductCategoryQuery();
  const products = useGetAllProductQuery({
    showAll: true,
    currentPage: 1,
    skip: 1,
  });

  const {
    addToOrderCart,
    orderCart,
    handleToggleLargeQuantity,
    handleToggleRegularQuantity,
    removeToOrderCart,
    handleToggleFixedQuantity,
  } = useContext(CreateOrderContext);

  const [opened, { close, open }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const menuProductItems = useMemo(() => {
    if (
      !productCategory?.data?.data?.productCategory ||
      !products?.data?.data?.products
    )
      return [];
    const data = mapProductWithCategory(
      products?.data?.data?.products,
      productCategory?.data?.data?.productCategory
    );

    return data;
  }, [
    productCategory?.data,
    products?.data,
    productCategory?.isLoading,
    products?.isLoading,
  ]);

  const handleOpenProductModal = (product: Product) => {
    setSelectedProduct(product);
    open();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div>
            <div className="flex items-center font-medium">
              <IconCup color={colors.orange[5]} />
              &nbsp;
              {selectedProduct?.name}
            </div>
            <Text fz="xs">
              {
                productType.find((item) =>
                  item.value.match(selectedProduct?.type ?? '')
                )?.label
              }
            </Text>
          </div>
        }
      >
        {selectedProduct && (
          <ProductOrderModal
            product={selectedProduct}
            closeModal={close}
            orderCart={orderCart ?? []}
            addToOrderCart={addToOrderCart}
            handleToggleLargeQuantity={handleToggleRegularQuantity}
            handleToggleRegularQuantity={handleToggleRegularQuantity}
            removeToOrderCart={removeToOrderCart}
            handleToggleFixedQuantity={handleToggleFixedQuantity}
          />
        )}
      </Modal>
      <Grid>
        <Grid.Col span={12} md={8}>
          <CreateOrderMenu
            handleOpenProductModal={handleOpenProductModal}
            data={menuProductItems}
            isLoading={productCategory?.isLoading || products?.isLoading}
          />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <CreateOrderCart
            orderCart={orderCart ?? []}
            addToOrderCart={addToOrderCart}
            handleToggleLargeQuantity={handleToggleLargeQuantity}
            handleToggleRegularQuantity={handleToggleRegularQuantity}
            removeToOrderCart={removeToOrderCart}
            handleToggleFixedQuantity={handleToggleFixedQuantity}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default CreateOrderPage;
