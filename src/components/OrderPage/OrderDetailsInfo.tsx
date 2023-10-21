import {
  Badge,
  Box,
  Divider,
  List,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { OrderSnapshot } from '@prisma/client';
import { IconCup } from '@tabler/icons-react';
import { format } from 'date-fns';
import { OrderCart } from '../CreateOrderPage/CreateOrderContextProvider';
import PriceDisplay from '../common/PriceDisplay';

type OrderDetailsInfoProps = {
  orderSnapshot?: OrderSnapshot;
};

const OrderDetailsInfo = ({ orderSnapshot }: OrderDetailsInfoProps) => {
  const { colors } = useMantineTheme();
  if (!orderSnapshot) return <Text>No Order details</Text>;

  const parseOrderSnapshot = JSON.parse(
    orderSnapshot?.snapshot_record
  ) as OrderCart[];
  console.log({ orderSnapshot });

  return (
    <>
      {orderSnapshot && (
        <Stack spacing="xs">
          <Divider />
          <Box>
            <Badge variant="light">Customer Name</Badge>
            <Text fw={600}>{orderSnapshot?.customer_name || '-'}</Text>
          </Box>
          <Box>
            <Badge>Total Amount</Badge>
            <Text fw={600}>
              {<PriceDisplay value={orderSnapshot?.total_amount} />}
            </Text>
          </Box>
          <Box>
            <Badge>Payment</Badge>
            <Text fw={600}>
              {<PriceDisplay value={orderSnapshot?.payment} />}
            </Text>
          </Box>
          <Box>
            <Badge>Change</Badge>
            <Text fw={600}>
              {<PriceDisplay value={orderSnapshot?.change} />}
            </Text>
          </Box>
          <Box>
            <Badge>Order Date</Badge>
            <Text fw={600}>
              {format(
                new Date(orderSnapshot?.created_at),
                'dd, MMMM yyyy - hh:mm a'
              )}
            </Text>
          </Box>
          <Box>
            <Badge>Orders</Badge>
            <List mt="sm" spacing="sm">
              {parseOrderSnapshot?.map((item) => {
                const regularSizeCount = `${item?.regularSizeQuantity} Regular`;
                const largeSizeCount = `${item?.largeSizeQuantity} Large`;
                const fixedSizeCount = `${item?.fixedPriceQuantity} Standard`;
                return (
                  <List.Item
                    key={item.orderProduct.id}
                    icon={<IconCup color={colors.orange[5]} />}
                  >
                    <Text fw={500}>
                      {item?.orderProduct?.name}
                      {item?.regularSizeQuantity ? (
                        <Badge color="teal" variant="outline">
                          {regularSizeCount}
                        </Badge>
                      ) : null}
                      {item?.largeSizeQuantity ? (
                        <Badge color="teal" variant="outline">
                          {largeSizeCount}
                        </Badge>
                      ) : null}
                      {item?.fixedPriceQuantity ? (
                        <Badge color="teal" variant="outline">
                          {fixedSizeCount}
                        </Badge>
                      ) : null}
                    </Text>
                  </List.Item>
                );
              })}
            </List>
          </Box>
        </Stack>
      )}
    </>
  );
};

export default OrderDetailsInfo;
