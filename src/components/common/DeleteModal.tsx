import { BaseSuccessResponse } from '@/types/BaseApiResponse';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { ReactNode, memo, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';
import Modal from './Modal';

export type DeleteModalProps = {
  isOpen: boolean;
  handleToggle: VoidFunction;
  handleClose: VoidFunction;
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
  handleToggle,
  isOpen,
  handleClose,
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
      handleClose();
    }
    if (isError) {
      parseErrorResponse(error);
    }
  }, [isSuccess, isError]);

  if (!isOpen) return null;

  return (
    <Modal handleToggle={handleToggle} isOpen={isOpen} title="Delete Product">
      <div>{message}</div>
      <hr className="my-2" />
      <div className="flex justify-end gap-2">
        <Button
          btnTitle="Delete"
          className="bg-red-500 text-xs"
          onClick={handleDelete}
          loading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default memo(DeleteModal);
