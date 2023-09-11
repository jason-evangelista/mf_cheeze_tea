import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { Product } from '@prisma/client';
import {
  IconCup,
  IconMinus,
  IconPlus,
  IconShoppingCartPlus,
  IconX,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import {
  CreateOrderContextProps,
  OrderCart,
  QuantityActionType,
} from './CreateOrderContextProvider';

type ProductOrderModalProps = {
  product: Product;
  closeModal?: VoidFunction;
  title?: string;
  titleDescription?: string;
  withRemoveAction?: boolean;
  orderCart: OrderCart[];
} & Omit<Partial<CreateOrderContextProps>, 'orderCart'>;

const ProductOrderModal = ({
  product,
  closeModal,
  title,
  titleDescription,
  withRemoveAction,
  orderCart,
  addToOrderCart,
  handleToggleLargeQuantity,
  handleToggleRegularQuantity,
  handleToggleFixedQuantity,
  removeToOrderCart,
}: ProductOrderModalProps) => {
  const { colors } = useMantineTheme();
  const isHaveSizeOption = product.type !== 'SERRADURA';

  const findQueOrder = orderCart?.find((item) =>
    item.orderProduct.id.match(product?.id)
  );

  const [localRegularQuantity, setLocalRegularQuantity] = useState(
    findQueOrder?.regularSizeQuantity ?? 0
  );
  const [localLargeQuantity, setLocalLargeQuantity] = useState(
    findQueOrder?.largeSizeQuantity ?? 0
  );

  const [localFixedQuantity, setLocalFixedQuantity] = useState(
    findQueOrder?.fixedPriceQuantity ?? 0
  );

  const handleAddToCart = () => {
    if (typeof addToOrderCart === 'undefined') return;
    addToOrderCart({
      orderProduct: product,
      largeSizeQuantity: localLargeQuantity,
      regularSizeQuantity: localRegularQuantity,
      fixedPriceQuantity: localFixedQuantity,
    });
    if (typeof closeModal !== 'undefined') {
      closeModal();
      return;
    }
  };

  const handleRemoveToCart = () => {
    if (typeof removeToOrderCart === 'undefined') return;
    removeToOrderCart(findQueOrder?.orderProduct?.id ?? '');
  };

  const handleRegularSize = (action: QuantityActionType) => {
    switch (action) {
      case 'Increment':
        setLocalRegularQuantity(localRegularQuantity + 1);
        break;
      case 'Decrement':
        if (localRegularQuantity <= 0) return;
        setLocalRegularQuantity(localRegularQuantity - 1);
        break;
    }
  };

  const handleLargeSize = (action: QuantityActionType) => {
    switch (action) {
      case 'Increment':
        setLocalLargeQuantity(localLargeQuantity + 1);
        break;
      case 'Decrement':
        if (localLargeQuantity <= 0) return;
        setLocalLargeQuantity(localLargeQuantity - 1);
        break;
    }
  };

  const handleFixedAmount = (action: QuantityActionType) => {
    switch (action) {
      case 'Increment':
        setLocalFixedQuantity(localFixedQuantity + 1);
        break;
      case 'Decrement':
        if (localFixedQuantity <= 0) return;
        setLocalFixedQuantity(localFixedQuantity - 1);
        break;
    }
  };

  //Trigger regular size
  useEffect(() => {
    if (findQueOrder) {
      if (typeof handleToggleRegularQuantity === 'undefined') return;
      handleToggleRegularQuantity(
        findQueOrder?.orderProduct?.id ?? '',
        localRegularQuantity
      );
    }
  }, [localRegularQuantity]);

  //Trigger large size
  useEffect(() => {
    if (findQueOrder) {
      if (typeof handleToggleLargeQuantity === 'undefined') return;
      handleToggleLargeQuantity(
        findQueOrder?.orderProduct?.id ?? '',
        localLargeQuantity
      );
    }
  }, [localLargeQuantity]);

  // Trigger Fixed size/amount
  useEffect(() => {
    if (findQueOrder) {
      if (typeof handleToggleFixedQuantity === 'undefined') return;
      handleToggleFixedQuantity(
        findQueOrder?.orderProduct?.id ?? '',
        localFixedQuantity
      );
    }
  }, [localFixedQuantity]);

  useEffect(() => {
    if (!findQueOrder) return;
    setLocalRegularQuantity(findQueOrder?.regularSizeQuantity ?? 0);
    setLocalLargeQuantity(findQueOrder?.largeSizeQuantity ?? 0);
    setLocalFixedQuantity(findQueOrder?.fixedPriceQuantity ?? 0);
  }, [findQueOrder]);

  return (
    <Box className="relative">
      {withRemoveAction && (
        <ActionIcon
          onClick={handleRemoveToCart}
          radius="lg"
          color="red"
          variant="filled"
          className="absolute -top-6 -right-6"
        >
          <IconX />
        </ActionIcon>
      )}
      {title && titleDescription && (
        <>
          <Title order={5} className="flex items-center">
            <span>
              <IconCup color={colors.orange[5]} />
            </span>
            {title}
          </Title>
          <Text m={0} fz="xs">
            {titleDescription}
          </Text>
        </>
      )}

      {isHaveSizeOption ? (
        <Stack spacing="xs">
          <Divider label="Size options" />
          <Box>
            <Box
              className="flex items-center justify-between"
              aria-label="Regular"
            >
              <Flex gap="sm" align="center">
                <Badge color="orange" variant="filled" size="lg">
                  Regular
                </Badge>
                <div className="font-semibold">
                  <PriceDisplay value={product?.regular_size_amount} />
                </div>
              </Flex>
              <Flex gap={4}>
                <ActionIcon
                  onClick={() => handleRegularSize('Decrement')}
                  color="orange"
                  variant="filled"
                  size="sm"
                >
                  <IconMinus />
                </ActionIcon>
                <Title order={5} px="xs">
                  {localRegularQuantity}
                </Title>
                <ActionIcon
                  onClick={() => handleRegularSize('Increment')}
                  color="orange"
                  variant="filled"
                  size="sm"
                >
                  <IconPlus />
                </ActionIcon>
              </Flex>
            </Box>
            {product?.regular_size_amount && (
              <Text fw="bold" mt="xs">
                <PriceDisplay
                  value={product?.regular_size_amount * localRegularQuantity}
                />
              </Text>
            )}
            <Divider />
          </Box>
          <Box>
            <Box
              className="flex items-center justify-between"
              aria-label="Regular"
            >
              <Flex align="center" gap="sm">
                <Badge color="teal" variant="filled" size="lg">
                  Large
                </Badge>
                <div className="font-semibold">
                  <PriceDisplay value={product?.large_size_amount} />
                </div>
              </Flex>
              <Flex gap={4}>
                <ActionIcon
                  onClick={() => handleLargeSize('Decrement')}
                  color="teal"
                  variant="filled"
                  size="sm"
                >
                  <IconMinus />
                </ActionIcon>
                <Title order={5} px="xs">
                  {localLargeQuantity}
                </Title>
                <ActionIcon
                  onClick={() => handleLargeSize('Increment')}
                  color="teal"
                  variant="filled"
                  size="sm"
                >
                  <IconPlus />
                </ActionIcon>
              </Flex>
            </Box>
            {product?.large_size_amount && (
              <Text fw="bold" mt="xs">
                <PriceDisplay
                  value={product?.large_size_amount * localLargeQuantity}
                />
              </Text>
            )}
            <Divider />
            <Flex justify="space-between" align="center" mt="sm">
              <Badge variant="outline" size="lg">
                Total
              </Badge>
              {product?.large_size_amount && product?.regular_size_amount && (
                <Text fw="bold">
                  <PriceDisplay
                    value={
                      product?.large_size_amount * localLargeQuantity +
                      product?.regular_size_amount * localRegularQuantity
                    }
                  />
                </Text>
              )}
            </Flex>
          </Box>
        </Stack>
      ) : (
        <Stack aria-label="Fixed" spacing="xs">
          <Divider label="Standard" />
          <Box className="flex items-center justify-between">
            <Flex align="center" gap="sm">
              <Badge color="teal" variant="filled" size="lg">
                Standard
              </Badge>
              <div className="font-semibold">
                <PriceDisplay value={product?.fixed_amount} />
              </div>
            </Flex>
            <Flex gap={4}>
              <ActionIcon
                onClick={() => handleFixedAmount('Decrement')}
                color="teal"
                variant="filled"
                size="sm"
              >
                <IconMinus />
              </ActionIcon>
              <Title order={5} px="xs">
                {localFixedQuantity}
              </Title>
              <ActionIcon
                onClick={() => handleFixedAmount('Increment')}
                color="teal"
                variant="filled"
                size="sm"
              >
                <IconPlus />
              </ActionIcon>
            </Flex>
          </Box>
          <Divider />
          <Flex align="center" justify="space-between">
            <Badge variant="outline" size="lg">
              Total
            </Badge>
            {product?.fixed_amount && (
              <Text fw="bold" mt="xs">
                <PriceDisplay
                  value={product?.fixed_amount * localFixedQuantity}
                />
              </Text>
            )}
          </Flex>
        </Stack>
      )}
      {!findQueOrder && (
        <Button
          disabled={
            isHaveSizeOption
              ? !localRegularQuantity && !localLargeQuantity
              : !localFixedQuantity
          }
          onClick={handleAddToCart}
          color="blue"
          size="xs"
          mt="md"
          fullWidth
          variant="light"
          leftIcon={<IconShoppingCartPlus />}
        >
          Add Order
        </Button>
      )}
    </Box>
  );
};

export default ProductOrderModal;
