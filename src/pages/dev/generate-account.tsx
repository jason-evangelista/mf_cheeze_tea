import Button from '@/components/common/Button';
import Input from '@/components/Input';
import SeoContainer from '@/components/SeoContainer';
import { GenerateAccountSchema, generateAccountSchema } from '@/schema/schema';
import { useCreateUserMutation } from '@/services/userService';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const GenerateAccount = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<GenerateAccountSchema>({
    resolver: yupResolver(generateAccountSchema),
  });
  const [generateAccount, { isLoading, isSuccess, data }] =
    useCreateUserMutation();

  const handleGenerate = async () => {
    generateAccount(getValues());
  };

  useEffect(() => {
    if (isSuccess) {
      toast(data?.message, {
        type: 'success',
        position: 'top-center',
        hideProgressBar: true,
      });
    }
  }, [data?.message, isSuccess]);

  return (
    <SeoContainer title="Generate Account">
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit(handleGenerate)}>
          <Input
            placeholder="Username"
            labelTitle="Username"
            {...register('username')}
            errorMessage={errors?.username?.message}
          />
          <Input
            type="password"
            labelTitle="Password"
            placeholder="Password"
            {...register('password')}
            errorMessage={errors?.password?.message}
          />
          <Button
            btnTitle="Generate Account"
            className="bg-green-500 w-full"
            loading={isLoading}
          />
        </form>
      </div>
    </SeoContainer>
  );
};

export default GenerateAccount;
