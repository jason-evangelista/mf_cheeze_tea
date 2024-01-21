import { productType } from '@/constants/productType';
import { ProductSchema, productSchema } from '@/schema/schema';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/services/productService';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Group,
  Image,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
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
  const theme = useMantineTheme();
  const {
    register,
    handleSubmit,
    setValue,
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
  const watchProductPhoto = watch('product_photo');

  const handleOndropImage = async (_files: FileWithPath[]) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(_files[0]);

    fileReader.onload = () => {
      setValue('product_photo', fileReader.result as string);
    };
  };

  const handleResetPhoto = () => {
    setValue('product_photo', '');
  };

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
      <Stack mt="sm" spacing="xs" pos="relative">
        <Text size="sm" weight={600}>
          Product Photo <span>(Optional)</span>
        </Text>
        <Dropzone
          multiple={false}
          onDrop={handleOndropImage}
          onReject={(files) => console.log('reject', { files })}
          maxSize={3 * 1024 ** 2}
          accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.webp]}
        >
          <Group position="center" noWrap>
            <Dropzone.Accept>
              <IconUpload size={50} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>
            <div>
              <Text size="xs" inline>
                Drag images here or click to select files
              </Text>
              <Text size="xs" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                3mb. <strong>Accepted file (png, jpg, jpeg, webp)</strong>
              </Text>
            </div>
          </Group>
        </Dropzone>
        {watchProductPhoto && (
          <>
            <Button
              size="xs"
              color="red"
              variant="light"
              onClick={handleResetPhoto}
            >
              Reset photo
            </Button>
            <Image
              src={watchProductPhoto}
              alt="product image"
              width={300}
              fit="scale-down"
              sx={{
                borderRadius: 8,
                border: `1px solid ${theme.colors.gray[3]}`,
                overflow: 'hidden',
              }}
            />
          </>
        )}
      </Stack>

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
