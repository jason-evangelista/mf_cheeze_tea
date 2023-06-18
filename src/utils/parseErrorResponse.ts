import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { toast } from 'react-toastify';

export const parseErrorResponse = (
  error: FetchBaseQueryError | SerializedError | undefined
) => {
  if (error && 'data' in error) {
    // @ts-ignore
    toast(error?.data?.message, {
      type: 'error',
      position: 'top-center',
    });
  }
};
