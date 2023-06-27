import { OrderSchema, orderSchema } from '@/schema/schema';
import { useCreateOrderMutation } from '@/services/orderService';
import {
  useGetAllProductQuery,
  useGetProductQuery,
} from '@/services/productService';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDebounce } from 'usehooks-ts';
import Button from '../common/Button';
import EditableSelect, { OptionItem } from '../common/EditableSelect';
import Input from '../common/Input';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import OrderComputation from './OrderComputation';

export type OrderFormProps = {
  isOpen: boolean;
  handleToggle: VoidFunction;
  handleClose: VoidFunction;
};

const initialValue: OrderSchema = {
  product_base_price: undefined,
  product_id: undefined,
  product_order_type: undefined,
  product_quantity: undefined,
  product_subtotal: undefined,
  product_order_date: new Date(),
};

const OrderForm = ({ handleToggle, isOpen, handleClose }: OrderFormProps) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<Required<OrderSchema>>({
    // @ts-ignore
    resolver: yupResolver(orderSchema),
  });

  const [addOrder, addOrderState] = useCreateOrderMutation();

  const [selectedValue, setSelectedValue] = useState<OptionItem>({
    label: '',
    value: '',
    id: '',
  });
  const debounceSearchKey = useDebounce(selectedValue?.label, 1000);
  const debounceProductId = useDebounce(selectedValue?.value, 1000);

  const productQuery = useGetAllProductQuery({
    currentPage: 0,
    showAll: true,
    skip: 0,
    searchKey: debounceSearchKey || undefined,
  });

  const oneProductQuery = useGetProductQuery(debounceProductId);

  const memoProduct = useMemo(() => {
    return productQuery?.data?.data?.products.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [productQuery?.data?.data]);

  const onItemClick = (value: OptionItem) => {
    if (selectedValue.label === value.label) return;
    reset({ ...initialValue });
    setSelectedValue(value);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    reset({ ...initialValue });
    setSelectedValue({ label: e.currentTarget.value, value: '', id: '' });
  };

  const isLoading =
    productQuery?.isLoading ||
    productQuery.isFetching ||
    selectedValue?.label !== debounceSearchKey;

  const doesHaveSizes =
    !!oneProductQuery?.data?.data?.product?.regular_size_amount ||
    !!oneProductQuery?.data?.data?.product?.large_size_amount;

  const isFixedPrice = oneProductQuery?.data?.data?.product?.fixed_amount;

  const watchProductOrderType = watch('product_order_type');
  const watchBasePrice = watch('product_base_price');
  const watchQuantity = watch('product_quantity');
  const watchSubTotal = watch('product_subtotal');
  const watchProductOrderDate = watch('product_order_date');

  const mapSizes = useMemo(() => {
    if (!doesHaveSizes) {
      setValue('product_order_type', `Fixed ${isFixedPrice}`);
      return [];
    }
    const result = Object.entries(oneProductQuery?.data?.data?.product ?? {})
      .filter(
        (item) =>
          item[0] === 'large_size_amount' || item[0] === 'regular_size_amount'
      )
      .map((item) => {
        return {
          label:
            ((item[0] === 'large_size_amount' &&
              `Large Size - ₱${item[1]}`) as string) ||
            ((item[0] === 'regular_size_amount' &&
              `Regular Size - ₱${item[1]}`) as string),

          value:
            ((item[0] === 'large_size_amount' && item[1]) as number) ||
            ((item[0] === 'regular_size_amount' && item[1]) as number),
          size:
            ((item[0] === 'large_size_amount' && 'Large') as string) ||
            ((item[0] === 'regular_size_amount' && 'Regular') as string),
        };
      });
    // setValue('product_order_type', `${result?.[0].size} ${result?.[0].value}`);
    return result;
  }, [oneProductQuery?.data?.data, watchBasePrice, watchProductOrderType]);

  useEffect(() => {
    if (!debounceProductId) return;
    setValue('product_id', oneProductQuery?.data?.data?.product?.id ?? '');
  }, [oneProductQuery?.data?.data]);

  useEffect(() => {
    oneProductQuery.refetch();
  }, [debounceProductId]);

  useEffect(() => {
    if (!doesHaveSizes) return;
    setValue(
      'product_order_type',
      `${mapSizes?.[0]?.size} ${mapSizes?.[0]?.value}`
    );
  }, [doesHaveSizes]);

  useEffect(() => {
    if (doesHaveSizes) {
      const extractBasePrice = watchProductOrderType?.split(' ');
      const findBasePrice = mapSizes.find((item) =>
        item.label.includes(extractBasePrice?.[0])
      );
      setValue('product_base_price', findBasePrice?.value ?? 0);
    }

    if (isFixedPrice) {
      setValue('product_base_price', isFixedPrice);
    }
  }, [
    watchProductOrderType,
    watchBasePrice,
    doesHaveSizes,
    isFixedPrice,
    debounceProductId,
    mapSizes,
    oneProductQuery.isFetching,
    oneProductQuery.isLoading,
  ]);

  useEffect(() => {
    if (!debounceProductId) return;
    const getSubTotal = watchBasePrice * watchQuantity;
    setValue('product_subtotal', getSubTotal);
  }, [watchQuantity, watchSubTotal, watchBasePrice]);

  const handleCreateOrder = async (payload: OrderSchema) => {
    if (!selectedValue.value) {
      setError('product_id', {
        message: 'Please select valid product',
        type: 'value',
      });
    }
    await addOrder(payload).unwrap();
  };

  useEffect(() => {
    if (addOrderState.isSuccess) {
      toast(addOrderState?.data?.message, {
        type: 'success',
        position: 'top-center',
      });
      reset(initialValue);
      handleClose();
    }

    if (addOrderState.isError) {
      toast(addOrderState?.data?.message, {
        type: 'error',
        position: 'top-center',
      });
    }

    return () => {
      reset(initialValue);
    };
  }, [addOrderState, reset]);

  return (
    <Modal title="Add Order" isOpen={isOpen} handleToggle={handleToggle}>
      <form onSubmit={handleSubmit(handleCreateOrder)}>
        <EditableSelect
          label="Select Product"
          value={selectedValue?.label}
          className="text-sm"
          data={memoProduct}
          onItemClick={onItemClick}
          onChange={(e) => onInputChange(e)}
          activeselecteditem={selectedValue?.value ?? ''}
          loading={isLoading}
        />

        <div className="border-t mt-4">
          {(doesHaveSizes || isFixedPrice) && (
            <h3 className="font-semibold text-sm py-2">Options</h3>
          )}

          {(oneProductQuery.isLoading || oneProductQuery.isFetching) && (
            <Loading label="Fetching product option" />
          )}
          {!oneProductQuery?.data?.data?.product && (
            <h3 className="font-semibold text-xs text-center py-2 text-gray-400">
              Select product to check options
            </h3>
          )}
          {oneProductQuery?.data?.data?.product && (
            <>
              {doesHaveSizes && (
                <div>
                  <label className="font-semibold text-sm block">
                    Select Size
                  </label>
                  <select
                    disabled={addOrderState.isLoading}
                    placeholder="Select Size"
                    className="w-full border py-2 text-sm"
                    {...register('product_order_type')}
                  >
                    {mapSizes.map((item, idx) => (
                      <option key={idx} value={`${item.size} ${item.value}`}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!!isFixedPrice && (
                <Input
                  labelTitle="Fixed Amount"
                  defaultValue={`₱${watchBasePrice || isFixedPrice}`}
                  disabled
                  className="text-sm w-full"
                />
              )}

              <Input
                placeholder="Quantity"
                labelTitle="Quantity"
                type="number"
                min={1}
                defaultValue={1}
                className="text-sm w-full"
                {...register('product_quantity')}
                inputMode="decimal"
                disabled={addOrderState.isLoading}
                errorMessage={errors?.product_quantity?.message}
              />
              <div>
                <h3 className="font-semibold text-sm">Order Date</h3>
                <DayPicker
                  disableNavigation={addOrderState.isLoading}
                  onSelect={(e) => setValue('product_order_date', new Date(e!))}
                  selected={watchProductOrderDate}
                  mode="single"
                  disabled={[{ before: new Date() }]}
                  className="text-sm !m-0"
                  modifiersStyles={{
                    selected: {
                      background: '#22c55e',
                    },
                  }}
                  styles={{
                    table: {
                      width: '100%',
                      maxWidth: 'unset',
                    },
                    months: {
                      display: 'block',
                    },
                  }}
                />
              </div>
              <OrderComputation
                basePrice={watchBasePrice}
                productName={debounceSearchKey}
                subTotal={watchSubTotal}
                qty={watchQuantity}
              />

              {(doesHaveSizes || isFixedPrice) && (
                <Button
                  disabled={
                    oneProductQuery.isLoading ||
                    oneProductQuery.isFetching ||
                    addOrderState.isLoading
                  }
                  loading={addOrderState.isLoading}
                  btnTitle="Create Order"
                  className="w-full bg-green-500 text-sm mt-3"
                />
              )}
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default OrderForm;
