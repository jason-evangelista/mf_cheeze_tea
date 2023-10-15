import {
  Box,
  Divider,
  Indicator,
  Loader,
  Paper,
  Title,
  clsx,
  useMantineTheme,
} from '@mantine/core';
import { Product } from '@prisma/client';
import { IconCup, IconShoppingBag } from '@tabler/icons-react';
import { useContext } from 'react';
import { CreateOrderContext } from './CreateOrderContextProvider';
import { ProductWithCategory } from './helper/mapProductWithCategory';

type CreateOrderMenuProps = {
  data: ProductWithCategory[];
  isLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  handleOpenProductModal: (_: Product) => void;
};

const CreateOrderMenu = ({
  data,
  isLoading,
  handleOpenProductModal,
}: CreateOrderMenuProps) => {
  const { colors } = useMantineTheme();
  const { orderCart } = useContext(CreateOrderContext);

  return (
    <Paper withBorder className="overflow-hidden sticky top-[4rem]" p="sm">
      <Title order={3} className="flex items-center gap-1">
        <IconShoppingBag size={32} color={colors.yellow[7]} />
        Menu List
      </Title>
      <Divider className="my-4" />
      <>
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        )}
      </>
      <>
        {!isLoading &&
          data.map((item) => (
            <Box key={item?.category?.id} className="my-4">
              <Title order={4} className="font-semibold flex items-center">
                {item?.category?.name}
              </Title>
              <div className="flex gap-2 flex-wrap">
                {item.products.map((product) => {
                  const isAlreadyInQue = orderCart?.find((item) =>
                    item?.orderProduct?.id.match(product?.id)
                  );
                  return (
                    <Indicator
                      key={product.id}
                      disabled={!isAlreadyInQue}
                      label="On Cart"
                      inline
                      color="teal"
                      className="font-semibold"
                      size={16}
                      position="top-center"
                    >
                      <Paper
                        key={product.id}
                        shadow="sm"
                        withBorder
                        p="sm"
                        className={clsx([
                          'cursor-pointer',
                          {
                            'hover:bg-gray-50/80': !isAlreadyInQue,
                          },
                        ])}
                        onClick={
                          isAlreadyInQue
                            ? undefined
                            : () => handleOpenProductModal(product)
                        }
                        component="a"
                        href={`#${product.id}`}
                      >
                        <Title
                          order={6}
                          className="font-normal flex items-center"
                        >
                          <span>
                            <IconCup color={colors.orange[5]} />
                          </span>
                          {product.name}
                        </Title>
                      </Paper>
                    </Indicator>
                  );
                })}
              </div>
            </Box>
          ))}
      </>
    </Paper>
  );
};

export default CreateOrderMenu;
