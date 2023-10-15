import {
  Button,
  Divider,
  Input,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import PriceDisplay from '../common/PriceDisplay';
import { PaymentDetailsParams } from './CreateOrderCart';

type CreateOrderPaymentDetailsProps = {
  totalAmount: number;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  handleSubmitOrder: (_: PaymentDetailsParams) => void;
};

const CreateOrderPaymentDetails = ({
  totalAmount,
  handleSubmitOrder,
  loading,
}: CreateOrderPaymentDetailsProps) => {
  const [payment, setPayment] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (payment && payment > totalAmount) {
      setChange(payment - totalAmount);
    }
  }, [payment, change]);

  return (
    <div>
      <Divider label="Total Amount" />
      <Text color="green" fw="bold" className="text-xl">
        <PriceDisplay value={totalAmount} />
      </Text>
      <Divider label="Customer Details" my="sm" />
      <Stack spacing="sm">
        <Input.Wrapper label="Customer Name(Optional)">
          <Input
            placeholder="Customer Name(Optional)"
            onChange={(e) => setCustomerName(e.currentTarget.value)}
            value={customerName}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Payment Amount">
          <NumberInput
            thousandsSeparator=","
            precision={2}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            onKeyUp={({ currentTarget }) => {
              currentTarget?.blur();
              currentTarget?.focus();
            }}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                : ''
            }
            value={payment}
            onChange={(v) => {
              setPayment(Number(v));
            }}
            type="number"
          />
        </Input.Wrapper>

        {payment ? (
          <>
            <Divider label="Change" />
            <div className="flex flex-col">
              <PriceDisplay value={payment} />
              <PriceDisplay value={totalAmount} />
              <Divider />
              {change && (
                <Text fw="bold" mt="xs">
                  <PriceDisplay value={change} />
                </Text>
              )}
            </div>
          </>
        ) : null}
        {payment! > totalAmount && (
          <Button
            loading={loading}
            onClick={() =>
              handleSubmitOrder({ change, payment, customerName, totalAmount })
            }
            disabled={totalAmount > payment}
          >
            Complete Order
          </Button>
        )}
      </Stack>
    </div>
  );
};

export default CreateOrderPaymentDetails;
