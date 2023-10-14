import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { SignInSchema, signInSchema } from '@/schema/schema';
import { useLoginUserMutation } from '@/services/userService';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { yupResolver } from '@hookform/resolvers/yup';
import jsCookie from 'js-cookie';
import Head from 'next/head';
import { useEffect } from 'react';
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

  const handleSignIn = async () => {
    await loginUser(getValues()).unwrap();
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

  return (
    <>
      <Head>
        <title>Sign in | MF Cheeze tea</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit(handleSignIn)}>
          <h1 className="text-xl font-medium text-center">Sign in</h1>
          <Input
            labelTitle="Username"
            placeholder="Username"
            {...register('username')}
            errorMessage={errors?.username?.message}
          />
          <Input
            labelTitle="Password"
            placeholder="Password"
            type="password"
            {...register('password')}
            errorMessage={errors?.password?.message}
          />
          <Button
            btnTitle="Login"
            className="bg-black w-full mt-2"
            loading={isLoading}
          />
        </form>
      </div>
    </>
  );
};

export default SignIn;
