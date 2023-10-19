import { SignInSchema, signInSchema } from '@/schema/schema';
import { useRequestPasswordResetMutation } from '@/services/managerUserService';
import { useLoginUserMutation } from '@/services/userService';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import jsCookie from 'js-cookie';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME ?? '';

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<SignInSchema>({
    resolver: yupResolver(signInSchema),
  });
  const [loginUser, { isLoading, isSuccess, isError, error, data }] =
    useLoginUserMutation();
  const [requestPassResetFn, requestPassResetState] =
    useRequestPasswordResetMutation();

  const [opened, { close, open }] = useDisclosure(false);
  const [emailReset, setEmailReset] = useState('');

  const handleSignIn = async () => {
    await loginUser(getValues()).unwrap();
  };

  const handleSendResetPassword = async () => {
    await requestPassResetFn({
      email: emailReset,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      jsCookie.set(COOKIE_NAME, data?.data?.token ?? '');
      window.location.reload();
    }
    if (isError) {
      parseErrorResponse(error);
    }
  }, [isSuccess, isError, error, data]);

  useEffect(() => {
    if (requestPassResetState?.isSuccess) {
      close();
      notifications.show({
        message: requestPassResetState?.data?.message,
        color: 'green',
      });
    }

    if (requestPassResetState?.isError) {
      close();
      notifications.show({
        // @ts-ignore
        message: requestPassResetState?.error?.data?.message,
        color: 'red',
      });
    }
  }, [requestPassResetState?.isSuccess, requestPassResetState?.isError]);

  return (
    <>
      <Modal opened={opened} onClose={close} centered title="Reset Password">
        <Stack>
          <TextInput
            placeholder="Enter Email"
            value={emailReset}
            onChange={(e) => setEmailReset(e.currentTarget?.value)}
          />
          <Button
            variant="light"
            color="red"
            onClick={handleSendResetPassword}
            disabled={!emailReset}
          >
            Reset Password
          </Button>
        </Stack>
      </Modal>
      <Head>
        <title>Sign in | MF Cheeze tea</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit(handleSignIn)}>
          <Stack spacing="sm">
            <h1 className="text-xl font-medium text-center">
              MF Cheeze Tea POS
            </h1>
            <TextInput
              label="Username"
              placeholder="Username"
              {...register('username')}
              error={errors?.username?.message}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              {...register('password')}
              error={errors?.password?.message}
            />

            <Button type="submit" loading={isLoading}>
              Login
            </Button>
            <Button
              type="button"
              mt="sm"
              size="xs"
              variant="white"
              onClick={open}
            >
              Forgot password?
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
};

export default SignIn;
