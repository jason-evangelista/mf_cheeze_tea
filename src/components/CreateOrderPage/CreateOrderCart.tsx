import { productType } from '@/constants/productType';
import { useCreateMultipleOrdersMutation } from '@/services/createOrderService';
import {
  Button,
  Divider,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCash, IconShoppingCart } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import {
  CreateOrderContext,
  CreateOrderContextProps,
  OrderCart,
} from './CreateOrderContextProvider';

import { DateValue } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import CreateOrderConfirmModal from './CreateOrderPaymentDetails';
import ProductOrderModal from './ProductOrderModal';

type CreateOrderCartProps = {
  orderCart: OrderCart[];
} & Omit<Partial<CreateOrderContextProps>, 'orderCart'>;

export type PaymentDetailsParams = {
  payment: number;
  change: number;
  customerName?: string;
  totalAmount: number;
  orderDate: DateValue
};

const CreateOrderCart = ({ orderCart, ...rest }: CreateOrderCartProps) => {
  const router = useRouter();
  const { colors } = useMantineTheme();
  const { overAllTotal } = useContext(CreateOrderContext);
  const [createOrderMultiple, createOrderMultipleState] =
    useCreateMultipleOrdersMutation();

  const [opened, { close, open }] = useDisclosure(false);

  const handleSubmitMultipleOrder = async (
    paymentDetails: PaymentDetailsParams
  ) => {
    if (!orderCart.length) return;

    createOrderMultiple({
      orderCart,
      ...paymentDetails,
    });
  };

  useEffect(() => {
    if (createOrderMultipleState.isSuccess) {
      notifications.show({
        title: 'Order Complete!',
        message: createOrderMultipleState?.data?.message,
        color: 'green',
      });
      close();
      router.replace('/orders');
    }
  }, [createOrderMultipleState]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div>
            <Text fw="bold">Order Payment Details</Text>
          </div>
        }
      >
        <CreateOrderConfirmModal
          totalAmount={overAllTotal ?? 0}
          loading={createOrderMultipleState.isLoading}
          handleSubmitOrder={handleSubmitMultipleOrder}
        />
      </Modal>
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
            <Button
              disabled={!overAllTotal || createOrderMultipleState?.isSuccess}
              fullWidth
              onClick={open}
              loading={createOrderMultipleState.isLoading}
            >
              Submit order
            </Button>
          </Stack>
        </Paper>
      ) : null}
    </>
  );
};

export default CreateOrderCart;
