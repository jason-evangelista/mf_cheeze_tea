import { productType } from '@/constants/productType';
import { ProductSchema, productSchema } from '@/schema/schema';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/productService';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Select, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { memo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export type ProductFormProps = {
  isOpen: boolean;
  initialValue?: ProductSchema & { id: string };
  handleClose: () => void;
  removeProdInfoOnClose: VoidFunction;
};
const ProductForm = ({
  isOpen,
  handleClose,
  initialValue,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductSchema>({
    //@ts-ignore
    resolver: yupResolver(productSchema),
    values: initialValue as Required<ProductSchema>,
  });

  const [addProduct, addProductState] = useCreateProductMutation();
  const [updateProduct, updateProductState] = useUpdateProductMutation();

  const watchFixedAmount = watch('fixed_amount');
  const watchLZAmount = watch('large_size_amount');
  const watchRZdAmount = watch('regular_size_amount');
  const watchProductType = watch('product_type');

  const handleMutateProduct = async (payload: ProductSchema) => {
    if (watchLZAmount && watchRZdAmount && watchFixedAmount) {
      setError('fixed_amount', {
        message: 'Fixed amount is for Serradura only, Please remove the value',
        type: 'value',
      });
      return;
    }

    // Update product
    if (initialValue?.id) {
      updateProduct({ ...payload, id: initialValue?.id });
      return;
    }

    // Proceed add product
    addProduct(payload);
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [isOpen]);

  useEffect(() => {
    if (watchProductType !== 'SERRADURA') {
      clearErrors(['large_size_amount', 'regular_size_amount']);
    }
  }, [clearErrors, watchProductType]);

  // Add product effect
  useEffect(() => {
    if (addProductState.isSuccess) {
      notifications.show({
        title: 'Product',
        message: addProductState?.data?.message,
        color: 'green',
      });
      reset();
      handleClose();
    }
    if (addProductState.isError) {
      parseErrorResponse(addProductState?.error);
    }
  }, [addProductState]);

  // Update Product Effect
  useEffect(() => {
    if (updateProductState.isSuccess) {
      notifications.show({
        title: 'Product',
        message: updateProductState?.data?.message,
        color: 'green',
      });
      reset();
      handleClose();
    }
    if (updateProductState.isError) {
      parseErrorResponse(updateProductState?.error);
    }
  }, [updateProductState]);

  return (
    <form
      onSubmit={handleSubmit(handleMutateProduct)}
      className="flex flex-col gap-2"
    >
      <TextInput
        placeholder="Product Name"
        label="Product Name"
        {...register('product_name')}
        error={errors?.product_name?.message}
      />
      <TextInput
        placeholder="00.00"
        label="Large Size Amount (If Applicable)"
        type="number"
        {...register('large_size_amount')}
        error={errors?.large_size_amount?.message}
      />
      <TextInput
        placeholder="00.00"
        label="Regular Size Amount (If Applicable)"
        type="number"
        {...register('regular_size_amount')}
        error={errors?.regular_size_amount?.message}
      />
      <TextInput
        placeholder="00.00"
        label="Fixed Amount (If Applicable)"
        type="number"
        {...register('fixed_amount')}
        error={errors?.fixed_amount?.message}
      />
      <div>
        <p className="text-sm font-medium">Product Type</p>
        <Controller
          name="product_type"
          control={control}
          defaultValue={productType[0].value}
          render={({ field }) => (
            <>
              <Select
                data={productType}
                placeholder="Select Product Type"
                {...field}
              />
            </>
          )}
        />
      </div>

      <Button
        type="submit"
        w="100%"
        size="xs"
        color="green"
        className="mt-3"
        loading={addProductState.isLoading || updateProductState.isLoading}
      >
        Save Product
      </Button>
    </form>
  );
};

export default memo(ProductForm);
