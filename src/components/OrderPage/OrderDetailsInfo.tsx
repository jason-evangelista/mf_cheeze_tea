import {
  Badge,
  Box,
  Divider,
  Group,
  Image,
  List,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { OrderSnapshot } from '@prisma/client';
import { IconCup, IconPhotoSearch } from '@tabler/icons-react';
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
                    icon={
                      item.orderProduct.photo ? (
                        <Image
                          width={100}
                          height={100}
                          alt={item.orderProduct.name}
                          src={item.orderProduct.photo}
                          fit="cover"
                          sx={{
                            borderRadius: 8,
                            border: `1px solid ${colors.gray[3]}`,
                            overflow: 'hidden',
                          }}
                        />
                      ) : (
                        <IconPhotoSearch size={80} color="gray" stroke={1.2} />
                      )
                    }
                  >
                    <Stack spacing={0}>
                      <Group noWrap align="center" spacing={0}>
                        <IconCup color={colors.orange[5]} />
                        <Text fw={500}>{item?.orderProduct?.name}</Text>
                      </Group>
                      <Text size="xs" mb={2} weight={500}>
                        {item.orderProduct?.type}
                      </Text>

                      <Group spacing="xs">
                        {item?.regularSizeQuantity ? (
                          <Badge color="teal" variant="outline" w={100}>
                            {regularSizeCount}
                          </Badge>
                        ) : null}
                        {item?.largeSizeQuantity ? (
                          <Badge color="teal" variant="outline" w={100}>
                            {largeSizeCount}
                          </Badge>
                        ) : null}
                        {item?.fixedPriceQuantity ? (
                          <Badge color="teal" variant="outline" w={100}>
                            {fixedSizeCount}
                          </Badge>
                        ) : null}
                      </Group>
                    </Stack>
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
