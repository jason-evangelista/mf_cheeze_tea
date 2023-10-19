import {
  useCheckResetPasswordIdQuery,
  useResetPasswordMutation,
} from '@/services/managerUserService';
import {
  Button,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ResetPassword = () => {
  const route = useRouter();

  const [defaultEmail, setDefaultEmail] = useState('');
  const { refetch, isLoading, data } = useCheckResetPasswordIdQuery({
    email: route.query?.email as string,
  });
  const [resetPasswordFn, resetPasswordState] = useResetPasswordMutation();

  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    await resetPasswordFn({
      email: route.query?.email as string,
      newPassword,
    });
  };

  useEffect(() => {
    setDefaultEmail(route.query?.email as string);
    refetch();
  }, [route.query?.email]);

  useEffect(() => {
    if (resetPasswordState?.isSuccess) {
      notifications.show({
        message: resetPasswordState?.data?.message,
        color: 'green',
      });
      route.replace('/sign-in');
    }

    if (resetPasswordState?.isError) {
      notifications.show({
        // @ts-ignore
        message: resetPasswordState?.error?.data?.message,
        color: 'red',
      });
    }
  }, [resetPasswordState?.isSuccess, resetPasswordState?.isError]);

  return (
    <div className="flex items-center justify-center flex-col mt-10 relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} />
      {data?.data?.user ? (
        <Stack>
          <Text fw="bold" fz="xl">
            Reset Password
          </Text>
          <TextInput defaultValue={defaultEmail} disabled />
          <PasswordInput
            placeholder="New Password"
            value={newPassword}
            onChange={(v) => setNewPassword(v.currentTarget?.value)}
          />
          <Button
            onClick={handleResetPassword}
            loading={resetPasswordState.isLoading}
            disabled={resetPasswordState.isLoading || !newPassword}
          >
            Save Password
          </Button>
        </Stack>
      ) : (
        <>
          <Text fw="bold" fz="xl">
            Sorry
          </Text>
          <Text>Invalid or expired reset password request.</Text>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
