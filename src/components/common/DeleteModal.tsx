import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { Button, Modal, Text } from '@mantine/core';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { ReactNode, memo, useEffect } from 'react';
import { toast } from 'react-toastify';

export type DeleteModalProps = {
  opened: boolean;
  onClose: VoidFunction;
  params?: Record<string, any>;
  message: ReactNode;
  deleteQuery: UseMutation<
    MutationDefinition<
      string,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      string,
      BaseSuccessResponse,
      'crmApi'
    >
  >;
};
const DeleteModal = ({
  deleteQuery,
  message,
  params,
  onClose,
  opened,
}: DeleteModalProps) => {
  const [deleteData, { isLoading, isSuccess, isError, error, data }] =
    deleteQuery();

  const handleDelete = async () => {
    deleteData(params?.id);
  };

  useEffect(() => {
    if (isSuccess) {
      toast(data?.message, {
        type: 'success',
        position: 'top-center',
      });
      onClose();
    }
    if (isError) {
      parseErrorResponse(error);
    }
  }, [isSuccess, isError]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw="bold">Delete Product</Text>}
    >
      <div>{message}</div>
      <hr className="my-2" />
      <div className="flex justify-end gap-2">
        {/* <Button
          btnTitle="Delete"
          className="bg-red-500 text-xs"
          onClick={handleDelete}
          loading={isLoading}
        /> */}
        <Button color="red" onClick={handleDelete} loading={isLoading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default memo(DeleteModal);
