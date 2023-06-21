import { productType } from '@/constants/productType';
import { ProductSchema, productSchema } from '@/schema/schema';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/productService';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

export type ProductFormProps = {
  isOpen: boolean;
  handleToggle: () => void;
  handleClose: () => void;
  initialValue?: ProductSchema & { id: string };
  removeProdInfoOnClose: VoidFunction;
};
const ProductForm = ({
  isOpen,
  handleToggle,
  handleClose,
  initialValue,
  removeProdInfoOnClose,
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
      toast(addProductState?.data?.message, {
        type: 'success',
        position: 'top-center',
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
      toast(updateProductState?.data?.message, {
        type: 'success',
        position: 'top-center',
      });
      reset();
      handleClose();
    }
    if (updateProductState.isError) {
      parseErrorResponse(updateProductState?.error);
    }
  }, [updateProductState]);

  return (
    <Modal
      title="Products"
      isOpen={isOpen}
      handleToggle={() => {
        handleToggle;
        removeProdInfoOnClose();
      }}
    >
      <form onSubmit={handleSubmit(handleMutateProduct)}>
        <Input
          placeholder="Product Name"
          className="text-sm w-full"
          labelTitle="Product Name"
          {...register('product_name')}
          errorMessage={errors?.product_name?.message}
        />
        <Input
          placeholder="00.00"
          className="text-sm w-full"
          labelTitle="Large Size Amount (If Applicable)"
          type="number"
          {...register('large_size_amount')}
          errorMessage={errors?.large_size_amount?.message}
        />
        <Input
          placeholder="00.00"
          className="text-sm w-full"
          labelTitle="Regular Size Amount (If Applicable)"
          type="number"
          {...register('regular_size_amount')}
          errorMessage={errors?.regular_size_amount?.message}
        />
        <Input
          placeholder="00.00"
          className="text-sm w-full"
          labelTitle="Fixed Amount (If Applicable)"
          type="number"
          {...register('fixed_amount')}
          errorMessage={errors?.fixed_amount?.message}
        />
        <div>
          <p className="text-sm font-medium">Product Type</p>
          <Controller
            name="product_type"
            control={control}
            defaultValue={productType[0].value}
            render={({ field: { onChange, value, ref } }) => (
              <Dropdown
                ref={ref}
                value={value}
                onChange={(val) => onChange(val.value)}
                controlClassName="!border"
                className="text-sm"
                options={productType}
                placeholder="Select product type"
              />
            )}
          />
        </div>
        <Button
          btnTitle="Save Product"
          className="bg-green-500 text-xs mt-3 w-full"
          loading={addProductState.isLoading || updateProductState.isLoading}
        />
      </form>
    </Modal>
  );
};

export default memo(ProductForm);
