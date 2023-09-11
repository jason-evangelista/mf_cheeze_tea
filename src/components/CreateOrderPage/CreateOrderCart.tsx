import { productType } from '@/constants/productType';
import {
  Button,
  Divider,
  Paper,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCash, IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import { useContext } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import {
  CreateOrderContext,
  CreateOrderContextProps,
  OrderCart,
} from './CreateOrderContextProvider';
import ProductOrderModal from './ProductOrderModal';

type CreateOrderCartProps = {
  orderCart: OrderCart[];
} & Omit<Partial<CreateOrderContextProps>, 'orderCart'>;

const CreateOrderCart = ({ orderCart, ...rest }: CreateOrderCartProps) => {
  const { colors } = useMantineTheme();
  const { overAllTotal } = useContext(CreateOrderContext);

  return (
    <>
      <Paper withBorder className="overflow-hidden" p="sm">
        <Title order={3} className="flex items-center gap-1">
          <IconShoppingCart size={32} color={colors.yellow[7]} />
          Order Cart
        </Title>
      </Paper>
      {orderCart?.map((item, index) => (
        <Paper
          key={index}
          p="md"
          my="sm"
          withBorder
          shadow="sm"
          id={item.orderProduct.id}
        >
          <ProductOrderModal
            orderCart={orderCart}
            product={item.orderProduct}
            withRemoveAction
            title={item?.orderProduct?.name}
            titleDescription={
              productType.find((product) =>
                product.value.match(item.orderProduct.type)
              )?.label
            }
            {...rest}
          />
        </Paper>
      ))}
      {orderCart.length ? (
        <Paper p="md" shadow="sm" withBorder mt="md">
          <Stack spacing="xs">
            <Title order={3} className="flex items-center">
              <span>
                <IconCash color={colors.orange[5]} />
              </span>
              Overall total amount
            </Title>
            <Title order={4}>
              <PriceDisplay value={overAllTotal} />
            </Title>
            <Divider />
            {/* TODO: saving data to database */}
            <Link href="/dashboard">
              <Button component='a' fullWidth>Submit order</Button>
            </Link>
          </Stack>
        </Paper>
      ) : null}
    </>
  );
};

export default CreateOrderCart;
